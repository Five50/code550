"use client";

import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/ui/transition-link";
import { useHeader } from "@/lib/header-context";
import { navigationMenu, type NavigationMenuItem } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/wordpress.d";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";

import { useState } from "react";

interface HeaderProps {
  className?: string;
  navigationItems?: MenuItem[];
}

export function Header({ className, navigationItems = [] }: HeaderProps) {
  const { isFixedPosition } = useHeader();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use WordPress navigation if available, otherwise fall back to static config
  const useWordPressNav = navigationItems && navigationItems.length > 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[100] py-4 px-4 xl:px-0 bg-white dark:bg-slate-900 backdrop-blur-[5px] shadow-xs shadow-blue-500/10 transition-all",
          className
        )}
        style={{ viewTransitionName: 'header' }}
        role="banner"
      >
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          {/* Site Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <TransitionLink
              href="/"
              className="hover:opacity-75 transition-opacity flex items-center gap-3"
              aria-label={`${siteConfig.site_name} homepage`}
            >
              <Image
                src="/logo-light.svg"
                alt={siteConfig.site_name}
                width={120}
                height={29}
                className="hidden dark:block"
                priority
              />
              <Image
                src="/logo-dark.svg"
                alt={siteConfig.site_name}
                width={120}
                height={29}
                className="dark:hidden block"
                priority
              />
            </TransitionLink>

            {/* Mobile Menu Button - Visible only on Mobile */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-slate-400 hover:text-white"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-slate-900 border-slate-800">
                <SheetHeader>
                  <SheetTitle className="text-left text-white">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1 mt-6" role="navigation" aria-label="Mobile navigation">
                  {useWordPressNav ? (
                    // WordPress menu items for mobile
                    navigationItems.map((item) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <div key={item.id} className="space-y-1">
                            <div className="text-sm font-medium px-3 py-2 text-slate-300">
                              {item.title}
                            </div>
                            <div className="pl-4 space-y-1">
                              {item.children.map((child) => (
                                <TransitionLink
                                  key={child.id}
                                  href={child.url}
                                  className="block text-sm px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                                  target={child.target || undefined}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.title}
                                </TransitionLink>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <TransitionLink
                          key={item.id}
                          href={item.url}
                          className="text-sm font-medium px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                          target={item.target || undefined}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </TransitionLink>
                      );
                    })
                  ) : (
                    // Static config menu items for mobile
                    Object.entries(navigationMenu).map(([key, item]) => {
                      if ('items' in item) {
                        return (
                          <div key={key} className="space-y-1">
                            <div className="text-sm font-medium px-3 py-2 text-slate-300">
                              {item.title}
                            </div>
                            <div className="pl-4 space-y-1">
                              {Object.entries(item.items).map(([label, href]) => (
                                <TransitionLink
                                  key={href}
                                  href={href}
                                  className="block text-sm px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {label}
                                </TransitionLink>
                              ))}
                            </div>
                          </div>
                        );
                      } else if ('href' in item) {
                        return (
                          <TransitionLink
                            key={key}
                            href={item.href}
                            className="text-sm font-medium px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.title}
                          </TransitionLink>
                        );
                      }
                      return null;
                    })
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation - Hidden on Mobile */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
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
              if ('items' in item) {
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
          <div className="flex items-center gap-2">
            {/* Call-to-Action Buttons */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex text-sm font-medium text-slate-400 border border-blue-600/10 transition-colors"
            >
              <TransitionLink href="/signin">
                Sign In
              </TransitionLink>
            </Button>
            <Button
              size="sm"
              asChild
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <TransitionLink href="/book-a-demo" aria-label="Book a Demo">
                <span className="hidden sm:inline">Book a Demo</span>
                <span className="sm:hidden">Demo</span>
              </TransitionLink>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
