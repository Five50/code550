import {Section, Container} from "@/components/craft";
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
        contact: {
            title: "Contact",
            items: [
                {name: "Discord", href: "/resources/implementation"},
                {name: "Twitter", href: "/resources/case-studies"},
                {name: "Github", href: "/resources/security"},
                {name: "Email", href: "/resources/support"},
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
    };

    return (
        <footer className={className} role="contentinfo">
            {/* Main Footer */}
            <Section className="relative text-slate-300 px-4 sm:px-6 lg:px-8 border border-blue-600/20">
                <Container className="relative">
                    <div className="py-16 lg:py-20">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                            {/* Company Informat ion */}
                            <div className="lg:col-span-5">
                                <div className="space-y-8">

                                    {/* Description */}
                                    <div className="space-y-6">
                                        <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                                            <Balancer>
                                                Enterprise fuel trading platform with real-time risk management,
                                                advanced analytics, and regulatory compliance.
                                            </Balancer>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Columns */}
                            <div className="lg:col-span-7">
                                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:gap-12">
                                    {Object.entries(footerNavigation).map(([key, section]) => (
                                        <div key={key} className="space-y-4">
                                            <nav aria-label={`Footer ${section.title} navigation`}>
                                                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                                                    {section.title}
                                                </h3>
                                                <ul className="mt-6 space-y-4" role="list">
                                                    {section.items.map((item) => (
                                                        <li key={item.href}>
                                                            <TransitionLink
                                                                href={item.href}
                                                                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
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
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Bottom Bar */}
            <Section className="border-t border-blue-800/25">
                <Container>
                    <div className="py-6">
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
                                {/* Language Switcher */}
                                <div className="flex items-center">
                                    <LanguageSwitcher/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </footer>
    );
}