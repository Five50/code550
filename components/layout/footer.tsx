import {Section} from "@/components/craft";
import {TransitionLink} from "@/components/ui/transition-link";
import {LanguageSwitcher} from "@/components/language-switcher";
import {siteConfig} from "@/site.config";

import Image from "next/image";

interface FooterProps {
    className?: string;
}

export function Footer({className}: FooterProps) {
    const currentYear = new Date().getFullYear();

    // Customize these navigation sections per site
    const footerNavigation = {
        pages: {
            title: "Pages",
            items: [
                {name: "Home", href: "/"},
                {name: "Blog", href: "/blog"},
                {name: "About", href: "/about"},
            ]
        },
        content: {
            title: "Content",
            items: [
                {name: "Categories", href: "/posts/categories"},
                {name: "Tags", href: "/posts/tags"},
                {name: "Authors", href: "/posts/authors"},
            ]
        },
    };

    return (
        <footer className={className} role="contentinfo">
            {/* Main Footer */}
            <Section className="text-slate-500 px-6 py-12 border-t border-slate-800">
                <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6">
                    {/* Site Information */}
                    <div className="col-span-4 md:col-span-3 lg:col-span-4">
                        <div className="flex flex-col gap-6">
                            {/* Logo */}
                            <Image
                                src="/logo-light.svg"
                                alt={siteConfig.site_name}
                                width={120}
                                height={30}
                                className="dark:block hidden"
                            />
                            <Image
                                src="/logo-dark.svg"
                                alt={siteConfig.site_name}
                                width={120}
                                height={30}
                                className="dark:hidden block"
                            />

                            {/* Description */}
                            <p className="text-base text-slate-500 leading-relaxed max-w-md">
                                {siteConfig.footerDescription}
                            </p>

                            {/* Language Switcher */}
                            {siteConfig.supportedLanguages.length > 1 && (
                                <div className="flex items-center">
                                    <LanguageSwitcher/>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 col-span-4 md:col-span-5 lg:col-span-8">
                        {Object.entries(footerNavigation).map(([key, section]) => (
                            <div key={key} className="flex flex-col gap-6">
                                <nav aria-label={`Footer ${section.title} navigation`}>
                                    <h3 className="text-sm font-semibold text-white tracking-wide uppercase mb-6">
                                        {section.title}
                                    </h3>
                                    <ul className="flex flex-col gap-3 mb-6 lg:mb-12" role="list">
                                        {section.items.map((item) => (
                                            <li key={item.href}>
                                                <TransitionLink
                                                    href={item.href}
                                                    className="inline-flex text-sm text-slate-400 hover:text-white transition-colors"
                                                >
                                                    {item.name}
                                                </TransitionLink>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Bottom Bar */}
            <Section className="text-slate-500 px-6 py-6 border-t border-slate-800">
                <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                    <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-400">
                        <p className="flex items-center gap-2">
                            &copy; {currentYear}
                            <TransitionLink
                                href="/"
                                className="font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                {siteConfig.copyrightHolder}
                            </TransitionLink>
                            <span className="text-slate-600">&bull;</span>
                            <span>All rights reserved</span>
                        </p>
                    </div>
                </div>
            </Section>
        </footer>
    );
}
