import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildMenuTree,
  convertMenuUrlToRelative,
  transformMenuItems,
  checkTemplate,
  checkPostTemplate,
  isNoTitleTemplate,
  isNoMetaTemplate,
  isFullWidthTemplate,
  isBlankTemplate,
  sanitizeContentUrls,
  WordPressAPIError,
} from '@/lib/wordpress';
import type { MenuItem } from '@/lib/wordpress.d';

// parseRankMathHead and parseNavigationContent are private — tested indirectly
// through getRankMathSEO / getAllMenus integration tests and via exported callers.

describe('WordPressAPIError', () => {
  it('should store message, status, and endpoint', () => {
    const err = new WordPressAPIError('Not found', 404, '/wp-json/wp/v2/posts');
    expect(err.message).toBe('Not found');
    expect(err.status).toBe(404);
    expect(err.endpoint).toBe('/wp-json/wp/v2/posts');
    expect(err.name).toBe('WordPressAPIError');
  });

  it('should be an instance of Error', () => {
    const err = new WordPressAPIError('fail', 500, '/endpoint');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('buildMenuTree', () => {
  const flatItems: MenuItem[] = [
    { id: 1, title: 'Home', url: '/', slug: 'home', target: '', classes: [], xfn: '', description: '', object_id: 0, object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link', parent: 0, menu_order: 1, attr_title: '' },
    { id: 2, title: 'About', url: '/about', slug: 'about', target: '', classes: [], xfn: '', description: '', object_id: 0, object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link', parent: 0, menu_order: 2, attr_title: '' },
    { id: 3, title: 'Team', url: '/about/team', slug: 'team', target: '', classes: [], xfn: '', description: '', object_id: 0, object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link', parent: 2, menu_order: 1, attr_title: '' },
    { id: 4, title: 'Contact', url: '/contact', slug: 'contact', target: '', classes: [], xfn: '', description: '', object_id: 0, object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link', parent: 0, menu_order: 3, attr_title: '' },
  ];

  it('should convert flat items to hierarchical tree', () => {
    const tree = buildMenuTree(flatItems);
    expect(tree).toHaveLength(3); // Home, About, Contact at root
    const about = tree.find(i => i.id === 2);
    expect(about?.children).toHaveLength(1);
    expect(about?.children?.[0].title).toBe('Team');
  });

  it('should sort root items by menu_order', () => {
    const tree = buildMenuTree(flatItems);
    expect(tree[0].title).toBe('Home');
    expect(tree[1].title).toBe('About');
    expect(tree[2].title).toBe('Contact');
  });

  it('should sort children by menu_order', () => {
    const itemsWithMultipleChildren: MenuItem[] = [
      ...flatItems,
      { id: 5, title: 'History', url: '/about/history', slug: 'history', target: '', classes: [], xfn: '', description: '', object_id: 0, object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link', parent: 2, menu_order: 2, attr_title: '' },
    ];
    const tree = buildMenuTree(itemsWithMultipleChildren);
    const about = tree.find(i => i.id === 2);
    expect(about?.children?.[0].title).toBe('Team');
    expect(about?.children?.[1].title).toBe('History');
  });

  it('should treat orphaned children as root items', () => {
    const orphanItem: MenuItem[] = [
      { id: 10, title: 'Orphan', url: '/orphan', slug: 'orphan', target: '', classes: [], xfn: '', description: '', object_id: 0, object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link', parent: 999, menu_order: 1, attr_title: '' },
    ];
    const tree = buildMenuTree(orphanItem);
    expect(tree).toHaveLength(1);
    expect(tree[0].title).toBe('Orphan');
  });

  it('should handle empty input', () => {
    expect(buildMenuTree([])).toEqual([]);
  });
});

describe('convertMenuUrlToRelative', () => {
  it('should convert WordPress absolute URL to relative path', () => {
    const result = convertMenuUrlToRelative('https://test.example.com/about');
    expect(result).toBe('/about');
  });

  it('should preserve query strings and hash', () => {
    const result = convertMenuUrlToRelative('https://test.example.com/page?q=1#section');
    expect(result).toBe('/page?q=1#section');
  });

  it('should return external URLs unchanged', () => {
    const result = convertMenuUrlToRelative('https://external.com/page');
    expect(result).toBe('https://external.com/page');
  });

  it('should return malformed URLs unchanged', () => {
    expect(convertMenuUrlToRelative('not-a-url')).toBe('not-a-url');
  });
});

describe('transformMenuItems', () => {
  it('should recursively convert URLs to relative', () => {
    const items: MenuItem[] = [
      {
        id: 1, title: 'Home', url: 'https://test.example.com/', slug: 'home',
        target: '', classes: [], xfn: '', description: '', object_id: 0,
        object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link',
        parent: 0, menu_order: 1, attr_title: '',
        children: [
          {
            id: 2, title: 'Sub', url: 'https://test.example.com/sub', slug: 'sub',
            target: '', classes: [], xfn: '', description: '', object_id: 0,
            object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link',
            parent: 1, menu_order: 1, attr_title: '',
          },
        ],
      },
    ];
    const result = transformMenuItems(items);
    expect(result[0].url).toBe('/');
    expect(result[0].children?.[0].url).toBe('/sub');
  });

  it('should handle items without children', () => {
    const items: MenuItem[] = [
      {
        id: 1, title: 'Solo', url: 'https://test.example.com/solo', slug: 'solo',
        target: '', classes: [], xfn: '', description: '', object_id: 0,
        object: 'custom', object_slug: '', type: 'custom', type_label: 'Custom Link',
        parent: 0, menu_order: 1, attr_title: '',
      },
    ];
    const result = transformMenuItems(items);
    expect(result[0].children).toBeUndefined();
  });
});

describe('checkTemplate', () => {
  it('should return false for undefined template', () => {
    expect(checkTemplate(undefined, 'no-title')).toBe(false);
  });

  it('should match exact template type', () => {
    expect(checkTemplate('no-title', 'no-title')).toBe(true);
  });

  it('should match page- prefix pattern', () => {
    expect(checkTemplate('page-no-title', 'no-title')).toBe(true);
  });

  it('should match single- prefix pattern', () => {
    expect(checkTemplate('single-no-title', 'no-title')).toBe(true);
  });

  it('should match .html suffix pattern', () => {
    expect(checkTemplate('page-no-title.html', 'no-title')).toBe(true);
  });

  it('should match legacy PHP template patterns', () => {
    expect(checkTemplate('template-full-width.php', 'full-width')).toBe(true);
  });

  it('should match partial includes', () => {
    // checkTemplate uses .includes(templateType) as a fallback
    expect(checkTemplate('custom-no-title-v2', 'no-title')).toBe(true);
  });

  it('should not match unrelated template', () => {
    expect(checkTemplate('page-sidebar', 'no-title')).toBe(false);
  });
});

describe('checkPostTemplate', () => {
  it('should check the template field', () => {
    expect(checkPostTemplate({ template: 'no-title' }, 'no-title')).toBe(true);
  });

  it('should check class_list for template indicators', () => {
    const post = { template: '', class_list: ['page-template-no-title', 'page'] };
    expect(checkPostTemplate(post, 'no-title')).toBe(true);
  });

  it('should check meta fields', () => {
    const post = { template: '', meta: { _wp_page_template: 'no-title' } };
    expect(checkPostTemplate(post, 'no-title')).toBe(true);
  });

  it('should return false when no match found', () => {
    const post = { template: '', class_list: ['page'], meta: {} };
    expect(checkPostTemplate(post, 'no-title')).toBe(false);
  });
});

describe('isNoTitleTemplate', () => {
  it('should detect no-title string template', () => {
    expect(isNoTitleTemplate('page-no-title')).toBe(true);
  });

  it('should detect no-title from post object', () => {
    expect(isNoTitleTemplate({ template: 'no-title' })).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isNoTitleTemplate(undefined)).toBe(false);
  });
});

describe('isNoMetaTemplate', () => {
  it('should detect no-meta template', () => {
    expect(isNoMetaTemplate('no-meta')).toBe(true);
  });

  it('should also detect no-title as no-meta', () => {
    expect(isNoMetaTemplate('no-title')).toBe(true);
  });

  it('should detect from post object', () => {
    expect(isNoMetaTemplate({ template: 'no-meta' })).toBe(true);
  });
});

describe('isFullWidthTemplate', () => {
  it('should detect full-width template', () => {
    expect(isFullWidthTemplate('full-width')).toBe(true);
  });

  it('should detect fullwidth variant', () => {
    expect(isFullWidthTemplate('fullwidth')).toBe(true);
  });

  it('should detect wide variant', () => {
    expect(isFullWidthTemplate('wide')).toBe(true);
  });

  it('should detect from post object', () => {
    expect(isFullWidthTemplate({ template: 'page-full-width' })).toBe(true);
  });
});

describe('isBlankTemplate', () => {
  it('should detect blank template', () => {
    expect(isBlankTemplate('blank')).toBe(true);
  });

  it('should detect empty variant', () => {
    expect(isBlankTemplate('empty')).toBe(true);
  });

  it('should detect canvas variant', () => {
    expect(isBlankTemplate('canvas')).toBe(true);
  });

  it('should detect from post object', () => {
    expect(isBlankTemplate({ template: 'page-blank' })).toBe(true);
  });

  it('should return false for standard template', () => {
    expect(isBlankTemplate('page')).toBe(false);
  });
});
