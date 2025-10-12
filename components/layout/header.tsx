"use client";

import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/ui/transition-link";
import { MegaMenu } from "@/components/nav/mega-menu";
import { MegaMenuContainer } from "@/components/nav/mega-menu-container";
import { useHeader } from "@/lib/header-context";
import { navigationMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/wordpress.d";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import { useState } from "react";

interface HeaderProps {
  className?: string;
  navigationItems?: MenuItem[];
}

export function Header({ className, navigationItems = [] }: HeaderProps) {
  const { isFixedPosition } = useHeader();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Use WordPress navigation if available, otherwise fall back to static config
  const useWordPressNav = navigationItems && navigationItems.length > 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[100] py-4 px-4 xl:px-0 bg-slate-900 backdrop-blur-[5px]",
          className
        )}
        style={{ viewTransitionName: 'header' }}
        role="banner"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Site Logo and Navigation */}
          <div className="flex items-center gap-8">
            <TransitionLink
              href="/"
              className="hover:opacity-75 transition-opacity flex items-center gap-3"
              aria-label={`${siteConfig.site_name} homepage`}
            >
              <svg
                width="120"
                height="29"
                viewBox="0 0 1000 240"
                className="transition-colors duration-300"
              >
                <g>
                  {/* Blue elements - keep original blue color */}
                  <path d="M66.09,197.86h-26.09l49.77-86.78c.57,0,1.04,1.07,1.32,1.51,4.13,6.55,7.57,13.78,11.72,20.34l.11.91-36.83,64.02Z" fill="#2b7fff" />
                  <path d="M110.61,120.44l-.63-.36c-3.48-6.9-8.08-13.29-11.61-20.15-.29-.56-.85-1.34-.76-1.96l32.51-56.56.76-.65,12.21,20.97.37,1.5-32.86,57.22Z" fill="#2b7fff" />
                  <path d="M80.55,197.86l29.92-51.62,12.88,22.55c-5.45,9.78-10.97,19.55-16.85,29.07h-25.95Z" fill="#2b7fff" />
                  <path d="M163.52,97.18c-2.22-4.79-6.14-10.79-8.9-15.49-.34-.58-3.39-6-3.73-5.76l-12.82,22.47,13,22.51,12.81-22.51c.11-.48-.18-.83-.37-1.22Z" fill="#2b7fff" />

                  {/* Light elements - always white on dark background */}
                  <polygon points="221.5 197.86 195.41 197.86 158.59 133.85 158.76 132.72 171.31 110.8 221.5 197.86" fill="white" />
                  <polygon points="150.92 145.86 137.9 168.42 154.57 197.58 180.66 197.58 150.92 145.86" fill="white" />
                  <polygon points="130.82 111.11 117.99 133.61 130.83 156.05 143.8 133.58 130.82 111.11" fill="white" />
                </g>
                <g>
                  {/* Text elements - always white on dark background */}
                  <path d="M269.02,197.86l40.33-119.09h32.89l40.33,119.09h-25.27l-8.65-26.31h-46.56l-8.48,26.31h-24.58ZM308.31,151.65h33.93l-16.44-50.54h-1.04l-16.44,50.54Z" fill="white" />
                  <path d="M402.65,197.86V69.26h23.02v128.61h-23.02Z" fill="white" />
                  <path d="M463.75,197.86v-69.76h-16.96v-18.52h16.96v-25.62h23.02v25.62h20.08v18.52h-20.08v69.76h-23.02Z" fill="white" />
                  <path d="M564.49,199.25c-7.5,0-13.76-.46-18.78-1.38-5.02-.92-9-2.42-11.94-4.5-2.94-2.08-5.11-4.85-6.49-8.31-1.38-3.46-2.25-7.79-2.6-12.98s-.52-11.36-.52-18.52.17-13.3.52-18.43c.35-5.13,1.21-9.43,2.6-12.9s3.55-6.23,6.49-8.31c2.94-2.08,6.92-3.55,11.94-4.41,5.02-.87,11.28-1.3,18.78-1.3s14.11.43,19.13,1.3c5.02.87,9,2.34,11.94,4.41s5.08,4.85,6.4,8.31c1.33,3.46,2.19,7.76,2.6,12.9.4,5.14.61,11.28.61,18.43s-.2,13.33-.61,18.52c-.41,5.19-1.27,9.52-2.6,12.98-1.33,3.46-3.46,6.23-6.4,8.31-2.94,2.08-6.92,3.58-11.94,4.5-5.02.92-11.4,1.38-19.13,1.38ZM564.49,180.73c4.38,0,7.82-.29,10.3-.87,2.48-.58,4.21-1.76,5.19-3.55.98-1.79,1.58-4.5,1.82-8.14.23-3.63.35-8.51.35-14.63s-.12-10.82-.35-14.45c-.23-3.63-.84-6.34-1.82-8.14-.98-1.79-2.71-2.94-5.19-3.46-2.48-.52-5.91-.78-10.3-.78s-7.62.26-10.04.78c-2.42.52-4.13,1.67-5.11,3.46-.98,1.79-1.59,4.5-1.82,8.14-.23,3.63-.35,8.45-.35,14.45s.11,10.99.35,14.63c.23,3.63.84,6.35,1.82,8.14.98,1.79,2.68,2.97,5.11,3.55,2.42.58,5.77.87,10.04.87Z" fill="white" />
                  <path d="M637.88,197.86v-119.09h72.35v9.87h-61.27v46.73h54.87v9.69h-54.87v52.79h-11.08Z" fill="white" />
                  <path d="M769.25,199.25c-6.69,0-12.09-.67-16.18-1.99-4.1-1.33-7.24-3.35-9.43-6.06-2.19-2.71-3.66-6.26-4.41-10.65-.75-4.38-1.13-9.58-1.13-15.58v-55.39h10.56v52.1c0,6.12.29,11.05.87,14.8.58,3.75,1.73,6.58,3.46,8.48,1.73,1.9,4.21,3.18,7.44,3.81,3.23.64,7.44.95,12.64.95,6.46,0,11.51-.84,15.15-2.51,3.63-1.67,6.26-4.04,7.88-7.10,1.61-3.06,2.62-6.69,3.03-10.9.4-4.21.61-8.85.61-13.93v-45.7h10.56v88.28h-9.35l-.52-13.5h-.87c-1.04,2.77-2.66,5.28-4.85,7.53-2.19,2.25-5.34,4.04-9.43,5.37-4.1,1.33-9.43,1.99-16.01,1.99Z" fill="white" />
                  <path d="M882.11,199.25c-6.92,0-12.7-.43-17.31-1.3-4.62-.87-8.37-2.34-11.25-4.41-2.89-2.08-5.05-4.87-6.49-8.39-1.44-3.52-2.42-7.85-2.94-12.98-.52-5.13-.78-11.22-.78-18.26,0-8.42.35-15.55,1.04-21.38.69-5.83,2.22-10.53,4.59-14.11,2.36-3.58,6.17-6.17,11.42-7.79,5.25-1.61,12.43-2.42,21.55-2.42,6.58,0,11.97.49,16.18,1.47,4.21.98,7.56,2.54,10.04,4.67,2.48,2.14,4.3,4.99,5.45,8.57,1.15,3.58,1.9,7.91,2.25,12.98.35,5.08.52,11.02.52,17.83v3.63h-62.49c0,6.69.32,12.18.95,16.44.63,4.27,1.9,7.62,3.81,10.04,1.9,2.42,4.9,4.1,9,5.02,4.09.92,9.61,1.38,16.53,1.38,2.88,0,6.06-.11,9.52-.35,3.46-.23,6.86-.49,10.21-.78,3.35-.29,6.34-.66,9-1.13v8.83c-2.31.46-5.19.9-8.65,1.3-3.46.4-7.10.69-10.9.87s-7.56.26-11.25.26ZM906.17,152.34v-5.71c0-6.58-.41-11.83-1.21-15.75-.81-3.92-2.14-6.86-3.98-8.83-1.85-1.96-4.36-3.26-7.53-3.89-3.18-.63-7.18-.95-12.03-.95-6.12,0-11.02.41-14.71,1.21-3.69.81-6.46,2.34-8.31,4.59-1.85,2.25-3.06,5.45-3.63,9.61-.58,4.15-.87,9.69-.87,16.62h55.56l-3.29,3.12Z" fill="white" />
                  <path d="M949.44,197.86V69.26h10.56v128.61h-10.56Z" fill="white" />
                </g>
              </svg>
            </TransitionLink>

            {/* Main Navigation */}
            <nav className="flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {useWordPressNav ? (
              // Render WordPress menu items
              navigationItems.map((item) => {
                // Check if item has children (dropdown)
                if (item.children && item.children.length > 0) {
                  return (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-sm font-medium flex items-center gap-1 h-auto px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                          {item.title}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48 bg-slate-900 border-slate-800">
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.id} asChild>
                            <TransitionLink
                              href={child.url}
                              className="w-full flex items-center px-2 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
                              target={child.target || undefined}
                            >
                              {child.title}
                            </TransitionLink>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                // Simple link without dropdown
                return (
                  <TransitionLink
                    key={item.id}
                    href={item.url}
                    className="text-sm font-medium px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                    target={item.target || undefined}
                  >
                    {item.title}
                  </TransitionLink>
                );
              })
            ) : (
              // Fallback to static config menu
              Object.entries(navigationMenu).map(([key, item]) => {
              // Check if item is a mega menu
              if ('type' in item && item.type === 'mega') {
                return (
                  <MegaMenu
                    key={key}
                    title={item.title}
                    sections={item.sections}
                    featuredContent={item.featuredContent}
                    isDarkBackground={true}
                    isActive={activeMenu === item.title}
                    onActivate={() => setActiveMenu(item.title)}
                    onDeactivate={() => setActiveMenu(null)}
                  />
                );
              }
              // Check if item has simple dropdown items
              else if ('items' in item) {
                return (
                  <DropdownMenu key={key}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-sm font-medium flex items-center gap-1 h-auto px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                      >
                        {item.title}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-slate-900 border-slate-800">
                      {Object.entries(item.items).map(([label, href]) => (
                        <DropdownMenuItem key={href} asChild>
                          <TransitionLink
                            href={href}
                            className="w-full flex items-center px-2 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
                          >
                            {label}
                          </TransitionLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else if ('href' in item) {
                // Simple link without dropdown
                return (
                  <TransitionLink
                    key={key}
                    href={item.href}
                    className="text-sm font-medium px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                  >
                    {item.title}
                  </TransitionLink>
                );
              }
              return null;
            })
            )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Call-to-Action Buttons */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm font-medium text-slate-400 border border-blue-600/10 transition-colors"
            >
              <TransitionLink href="/signin">
                Sign In
              </TransitionLink>
            </Button>
            <Button
              size="sm"
              asChild
            >
              <TransitionLink href="/book-a-demo" aria-label="Book a Demo">
                Book a Demo
              </TransitionLink>
            </Button>
          </div>
        </div>
      </header>

      {/* Mega Menu Container */}
      <MegaMenuContainer
        activeMenu={activeMenu}
        onClose={() => setActiveMenu(null)}
      />
    </>
  );
}
