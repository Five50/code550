// Define the menu items
export const mainMenu = {
  home: "/",
  about: "https://github.com/9d8dev/next-wp",
  blog: "/blog",
};

export const contentMenu = {
  categories: "/posts/categories",
  tags: "/posts/tags",
  authors: "/posts/authors",
  archive: "/posts/archive", // Keep archive for admin purposes
};

// AltoFuel navigation structure with mega menu support
export const navigationMenu = {
  platform: {
    title: "Platform",
    type: "mega",
    sections: {
      trading: {
        title: "Trading Tools",
        description: "Advanced fuel trading solutions",
        items: {
          "Real-time Trading": {
            href: "/platform/trading",
            description: "Execute trades with real-time market data"
          },
          "Risk Management": {
            href: "/platform/risk",
            description: "Advanced risk assessment and mitigation"
          },
          "Portfolio Analytics": {
            href: "/platform/analytics",
            description: "Comprehensive portfolio performance tracking"
          }
        }
      },
      markets: {
        title: "Market Data",
        description: "Global fuel market insights",
        items: {
          "Price Intelligence": {
            href: "/platform/pricing",
            description: "Real-time fuel pricing across global markets"
          },
          "Market Analysis": {
            href: "/platform/analysis",
            description: "In-depth market trends and forecasting"
          },
          "Supply Chain": {
            href: "/platform/supply-chain",
            description: "Track fuel supply and logistics"
          }
        }
      }
    },
    featuredContent: {
      title: "New: AI-Powered Trading",
      description: "Experience our latest AI algorithms that optimize fuel trading strategies with 95% accuracy.",
      href: "/features/ai-trading"
    }
  },
  solutions: {
    title: "Solutions",
    type: "mega",
    sections: {
      enterprise: {
        title: "Enterprise",
        description: "Solutions for large organizations",
        items: {
          "Fleet Management": {
            href: "/solutions/fleet",
            description: "Optimize fuel costs for large fleets"
          },
          "Corporate Trading": {
            href: "/solutions/corporate",
            description: "Enterprise-grade trading platforms"
          },
          "White Label": {
            href: "/solutions/white-label",
            description: "Customizable trading solutions"
          }
        }
      },
      industries: {
        title: "Industries",
        description: "Sector-specific solutions",
        items: {
          "Airlines": {
            href: "/solutions/airlines",
            description: "Jet fuel trading and hedging"
          },
          "Shipping": {
            href: "/solutions/shipping",
            description: "Marine fuel optimization"
          },
          "Energy Companies": {
            href: "/solutions/energy",
            description: "Comprehensive energy trading"
          }
        }
      }
    },
    featuredContent: {
      title: "Case Study: Global Airline",
      description: "See how a major airline reduced fuel costs by 15% using our AI-powered trading platform.",
      href: "/case-studies/airline"
    }
  },
  resources: {
    title: "Resources",
    items: {
      "Documentation": "/docs",
      "API Reference": "/api",
      "Market Reports": "/reports",
      "Blog": "/blog",
    }
  },
  pricing: {
    title: "Pricing",
    href: "/pricing"
  },
};
