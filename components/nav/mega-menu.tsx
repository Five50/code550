"use client";

import { TransitionLink } from "@/components/ui/transition-link";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface MegaMenuProps {
  title: string;
  sections: {
    [key: string]: {
      title: string;
      description?: string;
      items: {
        [key: string]: {
          href: string;
          description?: string;
        };
      };
    };
  };
  featuredContent?: {
    title: string;
    description: string;
    href: string;
    image?: string;
  };
  isDarkBackground: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export function MegaMenu({
  title,
  sections,
  featuredContent,
  isDarkBackground,
  isActive,
  onActivate,
  onDeactivate
}: MegaMenuProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors h-auto px-3 py-2 rounded-md relative",
          "text-slate-400 hover:text-white hover:bg-slate-800/50"
        )}
      >
        {title}
        <ChevronDown className="h-4 w-4" />
        {/* Active indicator */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
        )}
      </button>

      {/* Content for this specific menu */}
      {isActive && (
        <div className="hidden" data-menu-content={title}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Main Categories */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {Object.entries(sections).map(([key, section]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {section.title}
                      </h3>
                    </div>
                    {section.description && (
                      <p className="text-xs text-gray-600 ml-4">{section.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(sections).map(([key, section]) => (
                  <div key={key} className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-base border-b border-gray-100 pb-2">
                      {section.title}
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(section.items).map(([itemKey, item]) => (
                        <TransitionLink
                          key={itemKey}
                          href={item.href}
                          className="block group"
                        >
                          <div className="p-3 rounded-md hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 text-sm">
                              {itemKey}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-600 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </TransitionLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Content */}
            {featuredContent && (
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg h-full">
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Featured
                    </div>
                    <h5 className="font-semibold text-gray-900 text-base">
                      {featuredContent.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {featuredContent.description}
                    </p>
                    <TransitionLink
                      href={featuredContent.href}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Learn more →
                    </TransitionLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}