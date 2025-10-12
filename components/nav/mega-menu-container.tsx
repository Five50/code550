"use client";

import { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { navigationMenu } from "@/menu.config";

interface MegaMenuContainerProps {
  activeMenu: string | null;
  onClose: () => void;
}

export function MegaMenuContainer({ activeMenu, onClose }: MegaMenuContainerProps) {
  if (!activeMenu) return null;

  // Find the active menu data
  const menuData = Object.entries(navigationMenu).find(([key, item]) =>
    'type' in item && item.type === 'mega' && item.title === activeMenu
  )?.[1];

  if (!menuData || !('sections' in menuData)) return null;

  return (
    <>
      {/* Full-width dropdown container */}
      <div
        className="fixed left-0 right-0 top-16 bg-slate-900 shadow-2xl border-t border-slate-800/50 z-50 transition-all duration-200 ease-out opacity-100 translate-y-0"
        onMouseLeave={onClose}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Main Categories */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {Object.entries(menuData.sections).map(([key, section]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <h3 className="font-semibold text-white text-sm">
                        {section.title}
                      </h3>
                    </div>
                    {section.description && (
                      <p className="text-xs text-slate-400 ml-4">{section.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(menuData.sections).map(([key, section]) => (
                  <div key={key} className="space-y-4">
                    <h4 className="font-semibold text-white text-base border-b border-slate-800 pb-2">
                      {section.title}
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(section.items).map(([itemKey, item]) => (
                        <a
                          key={itemKey}
                          href={item.href}
                          className="block group"
                        >
                          <div className="p-3 rounded-md hover:bg-slate-800/50 transition-colors">
                            <div className="font-medium text-slate-200 group-hover:text-white text-sm">
                              {itemKey}
                            </div>
                            {item.description && (
                              <div className="text-xs text-slate-400 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Content */}
            {menuData.featuredContent && (
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 p-6 rounded-lg h-full">
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                      Featured
                    </div>
                    <h5 className="font-semibold text-white text-base">
                      {menuData.featuredContent.title}
                    </h5>
                    <p className="text-sm text-slate-400">
                      {menuData.featuredContent.description}
                    </p>
                    <a
                      href={menuData.featuredContent.href}
                      className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      Learn more →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to detect when mouse leaves dropdown area */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ top: '80px' }}
        onMouseEnter={onClose}
      />
    </>
  );
}