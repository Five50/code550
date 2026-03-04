import {HeaderSettings} from "@/components/header-settings";
import {getFrontPageContent, getPostsPaginated, getPostStyles} from "@/lib/wordpress";
import {filterWpStyles} from "@/lib/filter-wp-styles";
import {FrontPageTemplate} from "@/components/templates/front-page";

import {siteConfig} from "@/site.config";
import type {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const frontPage = await getFrontPageContent();

        if (frontPage.type === 'page' && frontPage.content) {
            return {
                title: frontPage.content.title.rendered,
                description: frontPage.content.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || frontPage.settings.blogdescription,
            };
        }

        return {
            title: frontPage.settings.blogname || siteConfig.site_name,
            description: frontPage.settings.blogdescription || "Latest posts and updates",
        };
    } catch (error) {
        return {
            title: siteConfig.site_name,
            description: siteConfig.site_description,
        };
    }
}

export default async function Home() {
    // Only show landing page on actual production domain, not on preview/dev deployments
    const isProductionDomain = process.env.VERCEL_ENV === 'production' &&
        process.env.VERCEL_URL === siteConfig.site_domain.replace('https://', '');

    if (isProductionDomain) {
        return <FallbackHomepage/>;
    }

    try {
        const frontPage = await getFrontPageContent();

        if (frontPage.type === 'page' && frontPage.content) {
            // Static front page - fetch styles and render with template
            const rawStyles = await getPostStyles(frontPage.content.id);
            const pageStyles = filterWpStyles(rawStyles);

            return (
                <>
                    <HeaderSettings isFixedPosition={false}/>
                    <FrontPageTemplate
                        page={frontPage.content}
                        styles={pageStyles}
                    />
                </>
            );
        }

        // Blog front page - show latest posts
        const {data: posts} = await getPostsPaginated(1, 6);

        return (
            <>
                <HeaderSettings isFixedPosition={false}/>
                <FrontPageTemplate
                    posts={posts.length > 0 ? posts : undefined}
                    blogName={frontPage.settings.blogname}
                    blogDescription={frontPage.settings.blogdescription}
                />
            </>
        );
    } catch (error) {
        console.error("Error loading front page:", error);
        return <FallbackHomepage/>;
    }
}

// Fallback component when WordPress is not available
function FallbackHomepage() {
    const { heading, description, ctaUrl, ctaLabel, supportEmail } = siteConfig.fallbackHomepage;
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8 py-20">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        {heading}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        {ctaUrl && (
                            <a
                                href={ctaUrl}
                                className="inline-flex items-center justify-center rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 border border-blue-500 transition-colors h-12 px-8"
                            >
                                {ctaLabel}
                            </a>
                        )}
                        {supportEmail && (
                            <a
                                href={`mailto:${supportEmail}`}
                                className="inline-flex items-center justify-center rounded-lg text-base font-semibold border border-slate-700/20 bg-slate-800/50 text-white hover:bg-slate-800 transition-colors h-12 px-8"
                            >
                                Contact Us
                            </a>
                        )}
                    </div>
                </div>
            </main>

            <footer className="py-6 px-4 border-t border-slate-800">
                <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
                    <p>&copy; {currentYear} {siteConfig.copyrightHolder}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
