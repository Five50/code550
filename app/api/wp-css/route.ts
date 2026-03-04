import { NextResponse } from "next/server";

const CACHE_DURATION = 86400; // 24 hours

export async function GET() {
  const wpUrl = process.env.WORDPRESS_URL?.replace(/\/$/, "");

  if (!wpUrl) {
    return new NextResponse("", { status: 404 });
  }

  const cssUrl = `${wpUrl}/wp-includes/css/dist/block-library/style.min.css`;

  const headers: HeadersInit = {};
  if (process.env.WORDPRESS_AUTH_USER && process.env.WORDPRESS_AUTH_PASSWORD) {
    const credentials = Buffer.from(
      `${process.env.WORDPRESS_AUTH_USER}:${process.env.WORDPRESS_AUTH_PASSWORD}`
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  try {
    const response = await fetch(cssUrl, { headers, next: { revalidate: CACHE_DURATION } });

    if (!response.ok) {
      return new NextResponse("", { status: 502 });
    }

    const css = await response.text();

    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
      },
    });
  } catch {
    return new NextResponse("", { status: 502 });
  }
}
