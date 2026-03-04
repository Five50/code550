// --- Menu item types ---

type NavLink = {
  title: string;
  href: string;
};

type NavDropdown = {
  title: string;
  items: Record<string, string>;
};

type NavMegaMenu = {
  title: string;
  type: "mega";
  sections: Record<string, MegaMenuSection>;
  featuredContent?: MegaMenuFeatured;
};

type MegaMenuSection = {
  title: string;
  description?: string;
  items: Record<string, { href: string; description?: string }>;
};

type MegaMenuFeatured = {
  title: string;
  description: string;
  href: string;
};

export type NavigationMenuItem = NavLink | NavDropdown | NavMegaMenu;

// --- Menu definitions ---

export const mainMenu: Readonly<Record<string, string>> = {
  home: "/",
  about: "/about",
  blog: "/blog",
};

export const contentMenu: Readonly<Record<string, string>> = {
  categories: "/posts/categories",
  tags: "/posts/tags",
  authors: "/posts/authors",
};

// Navigation structure - customize per site
// Supports simple links (NavLink), dropdown menus (NavDropdown), and mega menus (NavMegaMenu)
export const navigationMenu: Readonly<Record<string, NavigationMenuItem>> = {
  blog: {
    title: "Blog",
    href: "/blog",
  },
  content: {
    title: "Content",
    items: {
      "Categories": "/posts/categories",
      "Tags": "/posts/tags",
      "Authors": "/posts/authors",
    }
  },
  about: {
    title: "About",
    href: "/about",
  },
};
