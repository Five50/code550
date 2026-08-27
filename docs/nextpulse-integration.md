# NextPulse Integration Guide

How the Code550 Next.js app and the [NextPulse](https://www.code550.com/nextpulse) WordPress plugin talk to each other, and what has to be true on both sides for content changes to appear on the front end.

## Table of Contents

- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Part 1 — Next.js Setup](#part-1--nextjs-setup)
- [Part 2 — NextPulse Setup](#part-2--nextpulse-setup)
- [Part 3 — WordPress Content Setup](#part-3--wordpress-content-setup)
- [Part 4 — Verify the Connection](#part-4--verify-the-connection)
- [Webhook Contract](#webhook-contract)
- [What Actually Gets Revalidated](#what-actually-gets-revalidated)
- [Troubleshooting](#troubleshooting)

---

## How It Works

Two independent channels run between WordPress and Next.js:

**1. Read path — Next.js pulls content.**
Every function in `lib/wordpress.ts` fetches the WordPress REST API over HTTP Basic auth, tagged `wordpress` with a 1-hour TTL. This is how content reaches the app.

**2. Write signal — WordPress pushes a pulse.**
When content changes, NextPulse POSTs a signed webhook to `/api/revalidate`. The app purges its cache and re-pulls on the next request.

```
   WordPress                              Next.js
   ─────────                              ───────
   editor saves a post
        │
        ├─ NextPulse Listener resolves permalinks
        │
        └─ POST /api/revalidate ──────────▶ verify HMAC signature
             { contentType, contentId,          │
               paths }                          ├─ revalidateTag("wordpress")
                                                └─ revalidatePath(each path)
                                                        │
   REST API  ◀──────────────────────────────── refetch on next request
   /wp-json/wp/v2/...                           (Basic auth)
```

Without the pulse the site still updates — just up to an hour late, on the TTL. The pulse makes it immediate.

---

## Prerequisites

| Requirement | Version | Why |
|---|---|---|
| WordPress | 6.4+ | NextPulse requirement; core Navigation REST endpoint |
| PHP | 8.3+ | NextPulse requirement |
| Node.js | 20+ | Next.js 16 |
| Rank Math SEO | any | `lib/wordpress.ts` calls `rankmath/v1/getHead` for metadata |
| WPML | optional | Only needed for the `app/[lang]/` routes |

---

## Part 1 — Next.js Setup

Copy `.env.example` to `.env.local` and fill in all five variables:

```bash
# Where the WordPress REST API lives
WORDPRESS_URL="https://cms.code550.com"
WORDPRESS_HOSTNAME="cms.code550.com"

# Users > Profile > Application Passwords in WP admin
WORDPRESS_AUTH_USER="your-username"
WORDPRESS_AUTH_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"

# Generate with: openssl rand -base64 32
WORDPRESS_WEBHOOK_SECRET="your-secret-here"
```

Notes:

- `WORDPRESS_HOSTNAME` feeds `images.remotePatterns` in `next.config.ts`. If it is wrong, `next/image` throws on every WordPress image.
- The Application Password is pasted **with** its spaces, exactly as WordPress displays it.
- `WORDPRESS_WEBHOOK_SECRET` must match the secret in NextPulse byte for byte. It is used as the HMAC key, so a trailing newline or a stray space breaks every signature.
- If `WORDPRESS_WEBHOOK_SECRET` is unset, `/api/revalidate` returns 500 on every request rather than silently accepting unsigned pulses.

Start the app:

```bash
npm install
npm run dev
```

---

## Part 2 — NextPulse Setup

1. **Install** — WP admin > Plugins > Add New > Upload Plugin, upload the release zip, activate.

2. **Configure** — NextPulse > Settings:

   | Setting | Value |
   |---|---|
   | Next.js URL | Your front-end origin, no trailing slash (`https://code550.com`) |
   | Webhook secret | Same string as `WORDPRESS_WEBHOOK_SECRET` |
   | Revalidation path | `/api/revalidate` (the default; leave it) |
   | Content type filters | Enable the types you want pulsing |
   | Max retries | `3` is fine — retries back off 1s / 5s / 15s |
   | Dry run | Off. When on, NextPulse logs pulses without sending them |

   The **Next.js URL is the front end**, not the WordPress site. Pointing it at WordPress is the single most common misconfiguration.

3. **Save.** NextPulse issues a GET to the endpoint on save to check reachability. A 405 response is expected and healthy — the route only accepts POST.

---

## Part 3 — WordPress Content Setup

NextPulse handles the signal. These settings determine whether the *content* renders correctly.

### Permalinks

NextPulse resolves `paths` from `get_permalink()`, so WordPress permalinks must match Next.js routes.

| Content | Required WP permalink | Next.js route |
|---|---|---|
| Post | `/blog/%postname%/` | `app/blog/[slug]` |
| Service | `/services/x/` (CPT rewrite `services`) | `app/services/[slug]` |
| Case study | `/work/x/` (CPT rewrite `work`) | `app/work/[slug]` |
| Page | `/x/` | `app/[...slug]` |

Set **Settings > Permalinks** to a custom structure of `/blog/%postname%/`, and **Settings > Reading > Posts page** to a page with the slug `blog`.

If permalinks do not line up, content still updates — the `wordpress` tag purge covers it — but the targeted path revalidation is wasted. `team-member` permalinks (`/team/x/`) have no Next.js route at all; that is expected and harmless.

### Custom Post Types

Register all three with `show_in_rest => true`. Full registration code, including the block templates, is in [`wordpress-architecture.md`](./wordpress-architecture.md#custom-post-types).

| CPT | REST endpoint | Rewrite slug |
|---|---|---|
| `service` | `/wp-json/wp/v2/service` | `services` |
| `case-study` | `/wp-json/wp/v2/case-study` | `work` |
| `team-member` | `/wp-json/wp/v2/team-member` | `team` |
| `project-category` (taxonomy) | `/wp-json/wp/v2/project-category` | — |

Register the meta fields `icon` and `sort_order` (service) and `role` (team-member) with `show_in_rest => true`, or they will not appear in API responses.

### Menus

The app reads the **core Navigation endpoint**, `/wp-json/wp/v2/navigation` — not the `wp-api-menus` plugin. Register two locations:

```php
register_nav_menus([
    'primary' => 'Primary Navigation',
    'footer'  => 'Footer Navigation',
]);
```

### Blocks and Theme

Register the ten `code550/*` blocks and add the `theme.json` palette so block classes survive into `content.rendered` for `lib/wp-content-renderer.tsx` to map. See [`wordpress-architecture.md`](./wordpress-architecture.md).

### Locking Down the REST API

To hide the WordPress origin, require authentication on all of `/wp-json/*` — via a "Disable REST API" plugin, an mu-plugin returning 401 for unauthenticated requests, or server-level Basic auth. The app sends `Authorization` headers on every request, so it keeps working after lockdown.

---

## Part 4 — Verify the Connection

Work through these in order. Each one isolates a different failure.

**1. Can Next.js read WordPress?**

```bash
curl -u "$WORDPRESS_AUTH_USER:$WORDPRESS_AUTH_PASSWORD" \
  "$WORDPRESS_URL/wp-json/wp/v2/posts?per_page=1"
```

Expect a JSON array. A 401 means the Application Password is wrong.

**2. Is the webhook endpoint alive?**

```bash
curl -i -X POST https://code550.com/api/revalidate \
  -H 'Content-Type: application/json' --data '{"contentType":"all"}'
```

Expect **401 "Invalid webhook secret"**. That is the correct answer — it proves the route is deployed and rejecting unsigned traffic. A 404 means the route is not deployed.

**3. Does a correctly signed pulse succeed?**

```bash
SECRET="your-secret-here"
BODY='{"contentType":"all"}'
TS=$(date +%s)
SIG=$(printf '%s' "${TS}.${BODY}" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $NF}')

curl -i -X POST https://code550.com/api/revalidate \
  -H 'Content-Type: application/json' \
  -H "x-webhook-secret: $SECRET" \
  -H "x-webhook-signature: $SIG" \
  -H "x-webhook-timestamp: $TS" \
  --data "$BODY"
```

Expect `200 {"revalidated":true,...}`.

**4. Does WordPress reach it?** Use NextPulse's Connection Test button, or WP-CLI:

```bash
wp nextpulse test
wp nextpulse status
wp nextpulse revalidate --type=post --id=42
wp nextpulse history --status=failed --limit=10
```

**5. End to end.** Edit a post, save, then check NextPulse > History for a 200 with the resolved paths. Reload the front end.

The app's own test suite covers the handler:

```bash
npm run test:integration
```

---

## Webhook Contract

`POST /api/revalidate` — implemented in `app/api/revalidate/route.ts`, sent by `class-dispatcher.php`.

### Headers

| Header | Value |
|---|---|
| `x-webhook-secret` | The shared secret, compared in constant time |
| `x-webhook-timestamp` | Unix seconds. Rejected if more than 300s from server time |
| `x-webhook-signature` | `HMAC-SHA256("{timestamp}.{rawBody}", secret)`, hex |

The signature covers the **raw request bytes**. The route reads `request.text()` and never `request.json()`, because re-serializing the JSON would change the bytes and invalidate the signature.

### Body

```json
{
  "contentType": "post|page|term|author|media|menu|custom|all",
  "contentId": 123,
  "paths": ["/blog/my-post/"]
}
```

`contentId` and `paths` are optional. `paths` is capped at 50 entries per pulse.

### Responses

| Status | Meaning |
|---|---|
| 200 | Revalidated. Body lists the paths acted on |
| 400 | Malformed JSON, or a `contentType` outside the eight allowed values |
| 401 | Wrong secret, bad signature, missing headers, or a stale timestamp |
| 500 | `WORDPRESS_WEBHOOK_SECRET` is not configured |

---

## What Actually Gets Revalidated

Every accepted pulse calls `revalidateTag("wordpress", "max")`. Since every REST fetch in `lib/wordpress.ts` carries the `wordpress` tag, this one call invalidates all WordPress-derived data regardless of content type. It is the safety net — content is never left stale because a path failed to match.

On top of that:

| `contentType` | Path behavior |
|---|---|
| `post`, `page`, `term`, `author`, `custom` | `revalidatePath()` for each resolved path, trailing slash stripped |
| `menu`, `media`, `all` | `revalidatePath("/", "layout")` — these affect site-wide chrome |
| any type with no `paths` | `revalidatePath("/", "layout")` |

There are no per-item cache tags. `lib/wordpress.ts` emits only `wordpress`, `lang-{code}`, and the `posts-*` family from `getPostsPaginated()`. Tags like `post-123` or `categories` do not exist; calling `revalidateTag()` on them is a no-op.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| History shows 401 "Invalid webhook secret" | Secrets differ | Re-paste both. Watch for trailing whitespace |
| History shows 401 "Invalid webhook signature" | Secret matches but HMAC does not | Usually a proxy rewriting the request body. Check for WAF or CDN body transformation |
| History shows 401 "outside tolerance window" | Server clocks differ by more than 5 minutes | Fix NTP on the WordPress host |
| History shows 400 "Validation failed" | `contentType` outside the eight values | A `nextpulse_request_payload` filter is altering the payload |
| History shows 404 | Wrong Next.js URL, or the route is not deployed | Verify the URL is the front end and the revalidation path is `/api/revalidate` |
| Pulses succeed but content is stale | Reading from a different WordPress than the pulse came from | Confirm `WORDPRESS_URL` and the plugin live on the same site |
| Rapid saves produce one pulse | The 2-second cooldown is deduplicating | Expected. Raise or lower it in Settings |
| Nothing is sent at all | Dry run is on, or the content type is filtered out | Check both in Settings |
| Images 404 on the front end | `WORDPRESS_HOSTNAME` does not match | Match it to the WordPress host and restart the dev server |
| Metadata is empty | Rank Math missing | `getRankMathSEO()` needs `rankmath/v1/getHead` |

For deeper inspection, NextPulse's History page logs response codes, timing, and retry counts per pulse, and the Metrics page aggregates the last 24 hours.
