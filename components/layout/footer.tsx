import {Section} from "@/components/craft";
import {TransitionLink} from "@/components/ui/transition-link";
import {LanguageSwitcher} from "@/components/language-switcher";
import {mainMenu, contentMenu, navigationMenu} from "@/menu.config";
import {siteConfig} from "@/site.config";
import {Button} from "@/components/ui/button";
import {Github, Twitter, Linkedin, TrendingUp, Shield, Zap} from "lucide-react";

import Balancer from "react-wrap-balancer";
import Logo from "@/public/altofuel-light-inline.svg";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
    className?: string;
}

export function Footer({className}: FooterProps) {
    const currentYear = new Date().getFullYear();

    const footerNavigation = {
        product: {
            title: "Product",
            items: [
                {name: "Trading Dashboard", href: "/product/trading"},
                {name: "Risk Management", href: "/product/risk"},
                {name: "Inventory Tracking", href: "/product/inventory"},
                {name: "Price Analytics", href: "/product/analytics"},
                {name: "API Documentation", href: "/api"},
            ]
        },
        solutions: {
            title: "Solutions",
            items: [
                {name: "Fuel Trading", href: "/solutions/trading"},
                {name: "Derivatives & Hedging", href: "/solutions/derivatives"},
                {name: "Blending Operations", href: "/solutions/blending"},
                {name: "Multi-Tenant SaaS", href: "/solutions/saas"},
                {name: "Enterprise Integration", href: "/solutions/enterprise"},
            ]
        },
        company: {
            title: "Company",
            items: [
                {name: "About AltoFuel", href: "/about"},
                {name: "Careers", href: "/careers"},
                {name: "Contact Sales", href: "/contact"},
                {name: "Partners", href: "/partners"},
                {name: "Status", href: "/status"},
            ]
        },
        resources: {
            title: "Company",
            items: [
                {name: "About AltoFuel", href: "/about"},
                {name: "Careers", href: "/careers"},
                {name: "Contact Sales", href: "/contact"},
                {name: "Partners", href: "/partners"},
                {name: "Status", href: "/status"},
            ]
        },
        legal: {
            title: "Company",
            items: [
                {name: "Fair Use", href: "/about"},
                {name: "Careers", href: "/careers"},
                {name: "Contact Sales", href: "/contact"},
                {name: "Partners", href: "/partners"},
                {name: "Status", href: "/status"},
            ]
        },
        contact: {
            title: "Contact",
            items: [
                {name: "Discord", href: "/resources/implementation"},
                {name: "Twitter", href: "/resources/case-studies"},
                {name: "Github", href: "/resources/security"},
                {name: "Email", href: "/resources/support"},
            ]
        },
    };

    return (
        <footer className={className} role="contentinfo">
            {/* Main Footer */}
            <Section className="text-slate-500 px-6 py-12 border-t border-slate-800">
                {/* Main Footer Content */}
                <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-6">
                    {/* Company Information */}
                    <div className="col-span-4 md:col-span-3 lg:col-span-4">
                        <div className="flex flex-col gap-6">

                            {/* Emblem */}
                            <svg className="text-white" width="80" height="80" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 1000 1000">
                                <polygon
                                    points="940 880.87 813.5 880.87 634.96 570.49 635.81 565.02 696.64 458.75 940 880.87"
                                    fill="currentColor"/>
                                <path
                                    d="M186.5,880.87H60l241.33-420.76c2.77,0,5.04,5.17,6.41,7.34,20,31.76,36.68,66.8,56.8,98.64l.52,4.39-178.56,310.39Z"
                                    fill="#2b7fff"/>
                                <path
                                    d="M402.35,505.49l-3.05-1.76c-16.89-33.47-39.16-64.41-56.28-97.69-1.39-2.7-4.1-6.49-3.66-9.53L496.97,122.28l3.7-3.16,59.2,101.68,1.78,7.27-159.3,277.41Z"
                                    fill="#2b7fff"/>
                                <path
                                    d="M256.62,880.87l145.05-250.26,62.47,109.32c-26.43,47.41-53.19,94.81-81.7,140.94h-125.81Z"
                                    fill="#2b7fff"/>
                                <polygon points="597.8 628.76 534.66 738.12 615.5 879.5 742 879.5 597.8 628.76"
                                         fill="currentColor"/>
                                <g>
                                    <path
                                        d="M658.87,392.69c-10.78-23.22-29.75-52.32-43.13-75.12-1.64-2.8-16.44-29.07-18.09-27.95l-62.13,108.95,63.02,109.16,62.1-109.13c.54-2.33-.89-4.01-1.78-5.92Z"
                                        fill="#2b7fff"/>
                                    <polygon
                                        points="500.35 460.23 438.14 569.33 500.37 678.16 563.27 569.21 500.35 460.23"
                                        fill="currentColor"/>
                                </g>
                            </svg>

                            {/* Description */}
                            <p className="text-base text-slate-500 leading-relaxed max-w-md">
                                Enterprise fuel trading platform with real-time risk management,
                                advanced analytics, and regulatory compliance.
                            </p>

                            {/* Language Switcher */}
                            <div className="flex items-center">
                                <LanguageSwitcher/>
                            </div>
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
                    {/* Copyright and Legal */}
                    <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-400">
                        <p className="flex items-center gap-2">
                            &copy; {currentYear}
                            <TransitionLink
                                href="/"
                                className="font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                {siteConfig.site_name}
                            </TransitionLink>
                            <span className="text-slate-600">•</span>
                            <span>All rights reserved</span>
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-6">

                    </div>
                </div>
            </Section>
        </footer>
    );
}