# WordPress WPML & RankMath Setup Guide

This guide helps you configure WordPress with WPML (WordPress Multilingual Plugin) and RankMath for use with your headless Next.js application.

## Required WordPress Plugins

1. **WPML Multilingual CMS** (Premium)
2. **RankMath SEO** (Free/Pro)

## WPML Configuration

### 1. Install and Activate WPML

1. Download WPML from your account
2. Upload and activate all WPML components:
   - WPML Multilingual CMS
   - WPML String Translation
   - WPML Translation Management
   - WPML Media Translation (optional)

### 2. Configure Languages

1. Go to `WPML → Languages`
2. Add your languages:
   - **English** (en) - Set as default
   - **Spanish** (es)
3. Set language URL format to "Different languages in directories"
4. Enable "Hide URL language information for default language"

### 3. Enable WPML REST API

Add this to your theme's `functions.php` or a custom plugin:

```php
<?php
// Enable WPML REST API support
add_action('rest_api_init', function() {
    // Add language parameter to REST API
    add_filter('rest_post_query', 'wpml_rest_api_filter_posts_query', 10, 2);
    add_filter('rest_page_query', 'wpml_rest_api_filter_posts_query', 10, 2);
    add_filter('rest_category_query', 'wpml_rest_api_filter_terms_query', 10, 2);
    add_filter('rest_tag_query', 'wpml_rest_api_filter_terms_query', 10, 2);
});

function wpml_rest_api_filter_posts_query($args, $request) {
    $lang = $request->get_param('lang');
    if ($lang) {
        global $sitepress;
        $sitepress->switch_lang($lang);
    }
    return $args;
}

function wpml_rest_api_filter_terms_query($args, $request) {
    $lang = $request->get_param('lang');
    if ($lang) {
        global $sitepress;
        $sitepress->switch_lang($lang);
    }
    return $args;
}

// Add language information to REST API responses
add_action('rest_api_init', function() {
    register_rest_field(['post', 'page'], 'wpml_current_language', [
        'get_callback' => function($object) {
            return apply_filters('wpml_current_language', NULL);
        }
    ]);

    register_rest_field(['post', 'page'], 'wpml_translations', [
        'get_callback' => function($object) {
            return apply_filters('wpml_get_element_translations', NULL, $object['id'], 'post_' . $object['type']);
        }
    ]);
});

// Custom endpoint for WPML languages
add_action('rest_api_init', function() {
    register_rest_route('wpml/v1', '/languages', [
        'methods' => 'GET',
        'callback' => function() {
            $languages = apply_filters('wpml_active_languages', NULL, 'orderby=id&order=desc');
            return rest_ensure_response($languages);
        },
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('wpml/v1', '/current-language', [
        'methods' => 'GET',
        'callback' => function() {
            return rest_ensure_response([
                'current_language' => apply_filters('wpml_current_language', NULL)
            ]);
        },
        'permission_callback' => '__return_true'
    ]);
});
?>
```

## RankMath Configuration

### 1. Install and Configure RankMath

1. Install RankMath SEO plugin
2. Run the Setup Wizard
3. Configure basic SEO settings

### 2. Enable Headless CMS Support

1. Go to `Rank Math → General Settings → Others`
2. Enable "Headless CMS Support"
3. Save changes

### 3. Custom RankMath REST API (Optional)

If you need to update RankMath data via API, add this to your functions.php:

```php
<?php
// Custom RankMath REST API endpoints
add_action('rest_api_init', function() {
    // Add RankMath meta to REST API responses
    register_rest_field(['post', 'page'], 'rankmath_seo', [
        'get_callback' => function($object) {
            $post_id = $object['id'];
            return [
                'title' => get_post_meta($post_id, 'rank_math_title', true),
                'description' => get_post_meta($post_id, 'rank_math_description', true),
                'canonical_url' => get_post_meta($post_id, 'rank_math_canonical_url', true),
                'focus_keyword' => get_post_meta($post_id, 'rank_math_focus_keyword', true),
                'robots' => get_post_meta($post_id, 'rank_math_robots', true),
            ];
        }
    ]);
});
?>
```

## Environment Variables

Update your `.env.local` file:

```env
# WordPress Configuration
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_HOSTNAME=your-wordpress-site.com
WORDPRESS_WEBHOOK_SECRET=your-webhook-secret

# Optional: WPML API credentials if needed
WPML_API_KEY=your-wpml-api-key
```

## Testing the Setup

### 1. Test WPML API

```bash
# Get available languages
curl "https://your-site.com/wp-json/wpml/v1/languages"

# Get posts in Spanish
curl "https://your-site.com/wp-json/wp/v2/posts?lang=es"

# Get categories in Spanish
curl "https://your-site.com/wp-json/wp/v2/categories?lang=es"
```

### 2. Test RankMath API

```bash
# Get SEO head data for a specific URL
curl "https://your-site.com/wp-json/rankmath/v1/getHead?url=https://your-site.com/sample-post"
```

## Content Translation Workflow

1. **Create content in default language (English)**
2. **Translate content using WPML**:
   - Go to `WPML → Translation Management`
   - Select content to translate
   - Assign to translator or translate yourself
3. **Optimize SEO with RankMath**:
   - Add meta titles and descriptions for each language
   - Set focus keywords for each translation
   - Configure social media meta tags

## Next.js Integration

Your Next.js application is now configured to:

1. **Automatically detect language** from URL or headers
2. **Fetch localized content** from WordPress using WPML
3. **Include RankMath SEO data** in meta tags
4. **Generate proper sitemaps** and alternate language URLs
5. **Provide language switching** functionality

## Troubleshooting

### Common Issues

1. **404 errors on language URLs**: Check WPML URL format settings
2. **Missing translations**: Ensure content is fully translated in WPML
3. **SEO data not loading**: Verify RankMath Headless CMS Support is enabled
4. **CORS issues**: Add your Next.js domain to WordPress CORS settings

### Debugging

Enable WordPress debug mode:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check logs at `/wp-content/debug.log` for any API errors.