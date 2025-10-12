# WordPress Menu Setup for Next.js REST API

This guide explains how to set up WordPress menus that can be fetched via REST API for your Next.js frontend, with support for English and Spanish menus.

## Prerequisites

- WordPress installation at `https://digest.altofuel.com`
- Admin access to WordPress
- WPML plugin (for multilingual support) - Optional but recommended

## Part 1: Install WP REST API Menus Plugin

### Option 1: Using WordPress Admin (Recommended)

1. Log in to WordPress Admin
2. Go to **Plugins** → **Add New**
3. Search for "WP-REST-API V2 Menus"
4. Click **Install Now** on the plugin by **Claudio La Barbera**
5. Click **Activate**

### Option 2: Manual Installation

1. Download the plugin from: https://wordpress.org/plugins/wp-rest-api-v2-menus/
2. Upload to `wp-content/plugins/` directory
3. Activate via **Plugins** menu in WordPress Admin

### Option 3: Using WP-CLI

```bash
wp plugin install wp-rest-api-v2-menus --activate
```

## Part 2: Create Menu Locations in Your Theme

Add menu locations to your WordPress theme's `functions.php`:

```php
<?php
/**
 * Register navigation menus
 */
function altofuel_register_menus() {
    register_nav_menus([
        'primary' => __('Primary Navigation', 'altofuel'),
        'footer' => __('Footer Navigation', 'altofuel'),
    ]);
}
add_action('init', 'altofuel_register_menus');
```

## Part 3: Create Your Menus

### For English (Default)

1. Go to **Appearance** → **Menus**
2. Click **Create a new menu**
3. Name it "Primary Navigation" (or "Main Menu")
4. Check **Primary Navigation** under "Display location"
5. Click **Create Menu**

6. Add menu items:
   - Click **Pages** / **Custom Links** / **Posts**
   - Add your desired pages/links
   - Organize with drag-and-drop
   - Create sub-menus by dragging items slightly to the right

7. Click **Save Menu**

### For Spanish (with WPML)

If using WPML for multilingual support:

1. Install and activate WPML plugin
2. Go to **Appearance** → **Menus**
3. At the top, you'll see a language selector
4. Switch to **Spanish**
5. Create a new menu or translate existing one
6. Name it "Primary Navigation (Spanish)" or "Navegación Principal"
7. Assign to **Primary Navigation** location
8. Add Spanish pages/links
9. Click **Save Menu**

### Without WPML (Alternative)

If not using WPML, create separate menus:

1. Create menu: "Primary Navigation - English"
2. Create menu: "Primary Navigation - Spanish"
3. Assign English menu to "Primary Navigation" location
4. Spanish menu will be fetched by slug in your Next.js app

## Part 4: Verify API Endpoints

Test that menus are accessible via REST API:

### Check Available Menus
```
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus
```

### Check Menu Locations
```
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menu-locations
```

### Check Specific Menu by ID
```
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus/2
```

### Check Menu by Slug
```
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus/primary-navigation
```

### Check Menu by Location
```
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menu-locations/primary
```

### With WPML Language Parameter
```
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus/2?lang=es
https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus/2?lang=en
```

## Part 5: Menu Structure

The API returns menus in this structure:

```json
{
  "ID": 2,
  "name": "Primary Navigation",
  "slug": "primary-navigation",
  "description": "",
  "count": 5,
  "items": [
    {
      "id": 15,
      "order": 1,
      "parent": 0,
      "title": "Home",
      "url": "https://digest.altofuel.com/",
      "attr": "",
      "target": "",
      "classes": "",
      "xfn": "",
      "description": "",
      "object_id": 10,
      "object": "page",
      "object_slug": "home",
      "type": "post_type",
      "type_label": "Page",
      "children": []
    },
    {
      "id": 16,
      "order": 2,
      "parent": 0,
      "title": "About",
      "url": "https://digest.altofuel.com/about/",
      "attr": "",
      "target": "",
      "classes": "",
      "xfn": "",
      "description": "",
      "object_id": 12,
      "object": "page",
      "object_slug": "about",
      "type": "post_type",
      "type_label": "Page",
      "children": [
        {
          "id": 17,
          "order": 1,
          "parent": 16,
          "title": "Team",
          "url": "https://digest.altofuel.com/about/team/",
          "attr": "",
          "target": "",
          "classes": "",
          "xfn": "",
          "description": "",
          "object_id": 14,
          "object": "page",
          "object_slug": "team",
          "type": "post_type",
          "type_label": "Page",
          "children": []
        }
      ]
    }
  ],
  "meta": {
    "links": {
      "collection": "https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus",
      "self": "https://digest.altofuel.com/wp-json/wp-api-menus/v2/menus/2"
    }
  }
}
```

## Part 6: Using Menus in Next.js

Your Next.js app now has these functions available in `lib/wordpress.ts`:

### Fetch Primary Navigation

```typescript
import { getPrimaryNavigation } from '@/lib/wordpress';

// English menu
const englishMenu = await getPrimaryNavigation('en');

// Spanish menu
const spanishMenu = await getPrimaryNavigation('es');

// Default language (from WordPress settings)
const defaultMenu = await getPrimaryNavigation();
```

### Fetch Footer Navigation

```typescript
import { getFooterNavigation } from '@/lib/wordpress';

const footerMenu = await getFooterNavigation('en');
```

### Fetch Any Menu by Slug

```typescript
import { getMenuBySlug } from '@/lib/wordpress';

const menu = await getMenuBySlug('primary-navigation', 'es');
```

### Fetch All Menus

```typescript
import { getAllMenus } from '@/lib/wordpress';

const menus = await getAllMenus('en');
```

## Part 7: Example Component Usage

### Header Component with Dynamic Menu

```typescript
// app/layout.tsx or components/layout/header.tsx
import { getPrimaryNavigation } from '@/lib/wordpress';
import { MenuItem } from '@/lib/wordpress.d';

export async function Header({ language = 'en' }: { language?: string }) {
  const menuItems = await getPrimaryNavigation(language);

  return (
    <header>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <a href={item.url}>{item.title}</a>
              {item.children && item.children.length > 0 && (
                <ul>
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <a href={child.url}>{child.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

### With Next.js Link Component

```typescript
import Link from 'next/link';
import { TransitionLink } from '@/components/ui/transition-link';

export async function Navigation({ language = 'en' }: { language?: string }) {
  const menuItems = await getPrimaryNavigation(language);

  return (
    <nav>
      {menuItems.map((item) => (
        <div key={item.id}>
          <TransitionLink href={item.url}>
            {item.title}
          </TransitionLink>

          {item.children && (
            <div className="submenu">
              {item.children.map((child) => (
                <TransitionLink key={child.id} href={child.url}>
                  {child.title}
                </TransitionLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
```

## Part 8: Multi-Language Setup

### With WPML

WPML automatically handles menu translations:

```typescript
// English menu
const enMenu = await getPrimaryNavigation('en');

// Spanish menu
const esMenu = await getPrimaryNavigation('es');
```

### Without WPML (Manual Approach)

Create separate menus with language suffixes:

1. Create menus:
   - "primary-en" (English)
   - "primary-es" (Spanish)

2. Fetch by slug:
```typescript
const enMenu = await getMenuBySlug('primary-en');
const esMenu = await getMenuBySlug('primary-es');
```

## Part 9: Caching Strategy

Menu data is cached for 1 hour by default. To revalidate:

### On-Demand Revalidation

Add to your webhook handler (`app/api/revalidate/route.ts`):

```typescript
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();

  // Revalidate menu cache when menus change
  if (body.type === 'menu') {
    revalidateTag('wordpress');
    revalidateTag('lang-en');
    revalidateTag('lang-es');
  }

  return Response.json({ revalidated: true });
}
```

### Time-Based Revalidation

Menus automatically revalidate after 1 hour. To change:

```typescript
// In lib/wordpress.ts, modify the wordpressFetch function
next: {
  tags: language ? ["wordpress", `lang-${language}`] : ["wordpress"],
  revalidate: 86400, // 24 hours instead of 1 hour
}
```

## Part 10: Troubleshooting

### Menu API Not Working

**Problem**: Getting 404 errors on menu endpoints

**Solutions**:
1. Verify WP REST API Menus plugin is installed and activated
2. Go to **Settings** → **Permalinks** and click **Save Changes** (flushes rewrite rules)
3. Check WordPress version is 4.7+ (required for REST API)
4. Verify `.htaccess` file has correct rewrite rules

### Menu Items Missing

**Problem**: Menu exists but items array is empty

**Solutions**:
1. Check that menu items are actually added in WordPress Admin
2. Verify menu is assigned to a location
3. Check menu permissions (items may be hidden for non-authenticated users)

### WPML Language Not Working

**Problem**: Getting same menu for all languages

**Solutions**:
1. Verify WPML is properly configured
2. Check that you've created/translated menus for each language
3. Ensure menu is assigned to location in each language
4. Test API directly: `?lang=es` parameter

### External Links Not Working

**Problem**: All links are treated as internal

**Solution**: The `convertMenuUrlToRelative()` function automatically detects external links and leaves them unchanged. Verify your `WORDPRESS_URL` environment variable is correct.

### CORS Errors

**Problem**: CORS errors when fetching menus

**Solution**: Add to your WordPress theme's `functions.php`:

```php
function altofuel_add_cors_headers() {
    header('Access-Control-Allow-Origin: https://altofuel.com');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
}
add_action('rest_api_init', 'altofuel_add_cors_headers');
```

## Part 11: Best Practices

### Menu Organization

1. **Keep menus shallow**: Maximum 2 levels deep for better UX
2. **Limit items**: 5-7 top-level items for header navigation
3. **Use descriptive names**: "Primary Navigation" not just "Menu 1"
4. **Consistent structure**: Keep English and Spanish menus structurally similar

### Performance

1. **Cache aggressively**: Menus change infrequently
2. **Use ISR**: Let Next.js handle incremental static regeneration
3. **Webhook revalidation**: Set up WordPress webhooks to clear cache on menu changes

### Accessibility

1. **Descriptive titles**: Use clear, descriptive menu item names
2. **ARIA labels**: Add proper ARIA labels in your components
3. **Keyboard navigation**: Ensure submenus are keyboard accessible

## Part 12: Alternative: Custom Menu Endpoint

If you can't install plugins, create a custom endpoint in your theme's `functions.php`:

```php
<?php
/**
 * Custom menu endpoint
 */
function altofuel_register_menu_endpoint() {
    register_rest_route('menus/v1', '/menus', [
        'methods' => 'GET',
        'callback' => 'altofuel_get_menus',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('menus/v1', '/menus/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => 'altofuel_get_menu_by_slug',
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'altofuel_register_menu_endpoint');

function altofuel_get_menus() {
    $menus = wp_get_nav_menus();
    $response = [];

    foreach ($menus as $menu) {
        $items = wp_get_nav_menu_items($menu->term_id);
        $menu_data = [
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'description' => $menu->description,
            'count' => $menu->count,
            'items' => altofuel_format_menu_items($items)
        ];
        $response[] = $menu_data;
    }

    return rest_ensure_response($response);
}

function altofuel_get_menu_by_slug($data) {
    $slug = $data['slug'];
    $menu = wp_get_nav_menu_object($slug);

    if (!$menu) {
        return new WP_Error('no_menu', 'Menu not found', ['status' => 404]);
    }

    $items = wp_get_nav_menu_items($menu->term_id);

    return rest_ensure_response([
        'id' => $menu->term_id,
        'name' => $menu->name,
        'slug' => $menu->slug,
        'description' => $menu->description,
        'count' => $menu->count,
        'items' => altofuel_format_menu_items($items)
    ]);
}

function altofuel_format_menu_items($items) {
    if (!$items) return [];

    $formatted = [];

    foreach ($items as $item) {
        $formatted[] = [
            'id' => $item->ID,
            'order' => $item->menu_order,
            'parent' => $item->menu_item_parent,
            'title' => $item->title,
            'url' => $item->url,
            'attr' => $item->attr_title,
            'target' => $item->target,
            'classes' => implode(' ', $item->classes),
            'xfn' => $item->xfn,
            'description' => $item->description,
            'object_id' => $item->object_id,
            'object' => $item->object,
            'object_slug' => get_post_field('post_name', $item->object_id),
            'type' => $item->type,
            'type_label' => $item->type_label,
        ];
    }

    return $formatted;
}
```

---

## Summary

You now have:

✅ WordPress menus accessible via REST API
✅ Multi-language menu support (English & Spanish)
✅ Helper functions in Next.js to fetch menus
✅ Automatic URL conversion for internal links
✅ Hierarchical menu structure support
✅ Caching and revalidation strategy

Your Next.js app can now pull navigation dynamically from WordPress, with full support for both English and Spanish menus!
