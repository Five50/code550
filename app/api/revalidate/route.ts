import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 30;

/**
 * NextPulse webhook handler.
 *
 * Contract: wp-content/plugins/nextpulse/includes/revalidation/class-dispatcher.php
 *   headers  x-webhook-secret, x-webhook-signature, x-webhook-timestamp
 *   signature hash_hmac('sha256', "{timestamp}.{rawBody}", secret)
 *   body     { contentType, contentId?, paths? }
 */

/** Replay window for x-webhook-timestamp, in seconds. */
const TIMESTAMP_TOLERANCE_SECONDS = 300;

/** Cache profile passed to revalidateTag — "max" purges regardless of age. */
const CACHE_PROFILE = "max";

/** Every wordpressFetch in lib/wordpress.ts carries this tag. */
const WORDPRESS_TAG = "wordpress";

/** Upper bound on paths honored per webhook, so one payload can't fan out unbounded. */
const MAX_PATHS = 50;

/** Content types that invalidate site-wide chrome, not just a content route. */
const SITE_WIDE_CONTENT_TYPES = new Set(["menu", "media", "all"]);

/** Mirrors NextPulse Enum_Content_Type. */
const PayloadSchema = z.object({
  contentType: z.enum([
    "post",
    "page",
    "term",
    "author",
    "media",
    "menu",
    "custom",
    "all",
  ]),
  contentId: z.number().int().positive().nullable().optional(),
  paths: z
    .array(z.string().startsWith("/").max(2048))
    .max(MAX_PATHS)
    .optional(),
});

function isEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function verifySignature(
  request: NextRequest,
  rawBody: string,
  secret: string
): string | null {
  const provided = request.headers.get("x-webhook-secret");
  if (!provided || !isEqual(provided, secret)) {
    return "Invalid webhook secret";
  }

  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");
  if (!signature || !timestamp) {
    return "Missing webhook signature headers";
  }

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt)) {
    return "Malformed webhook timestamp";
  }

  const age = Math.abs(Math.floor(Date.now() / 1000) - sentAt);
  if (age > TIMESTAMP_TOLERANCE_SECONDS) {
    return "Webhook timestamp outside tolerance window";
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return isEqual(signature, expected) ? null : "Invalid webhook signature";
}

export async function POST(request: NextRequest) {
  const secret = process.env.WORDPRESS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("WORDPRESS_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { revalidated: false, message: "Webhook not configured" },
      { status: 500 }
    );
  }

  // Read the raw body: the HMAC covers the exact bytes WordPress sent.
  const rawBody = await request.text();

  const authError = verifySignature(request, rawBody, secret);
  if (authError) {
    console.error(`NextPulse webhook rejected: ${authError}`);
    return NextResponse.json(
      { revalidated: false, message: authError },
      { status: 401 }
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { revalidated: false, message: "Malformed JSON body" },
      { status: 400 }
    );
  }

  const result = PayloadSchema.safeParse(parsedBody);
  if (!result.success) {
    return NextResponse.json(
      {
        revalidated: false,
        message: "Validation failed",
        details: result.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { contentType, contentId, paths } = result.data;

  try {
    // Single lever: lib/wordpress.ts tags every REST fetch "wordpress", so this
    // invalidates all WordPress-derived data regardless of content type.
    revalidateTag(WORDPRESS_TAG, CACHE_PROFILE);

    const revalidatedPaths: string[] = [];

    if (paths?.length && !SITE_WIDE_CONTENT_TYPES.has(contentType)) {
      for (const path of paths) {
        // WordPress permalinks carry a trailing slash; Next.js routes do not.
        const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
        revalidatePath(normalized);
        revalidatedPaths.push(normalized);
      }
    } else {
      // No resolved paths, or the change affects nav/media used site-wide.
      revalidatePath("/", "layout");
      revalidatedPaths.push("/ (layout)");
    }

    console.log(
      `NextPulse revalidated ${contentType}${
        contentId ? ` (ID: ${contentId})` : ""
      }: ${revalidatedPaths.join(", ")}`
    );

    return NextResponse.json({
      revalidated: true,
      contentType,
      contentId: contentId ?? null,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("NextPulse revalidation failed", {
      contentType,
      contentId,
      error,
    });
    return NextResponse.json(
      {
        revalidated: false,
        message: "Revalidation failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
