import { Section, Article } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import parse from "html-react-parser";
import Link from "next/link";

interface FrontPageTemplateProps {
  page?: any;
  posts?: any[];
  styles?: string;
  blogName?: string;
  blogDescription?: string;
}

/**
 * Front Page template - Used for the site's front page
 * Matches WordPress "front-page" template
 */
export function FrontPageTemplate({
  page,
  posts,
  styles,
  blogName,
  blogDescription,
}: FrontPageTemplateProps) {
  // If a static page is set as front page
  if (page && page.content && page.content.rendered) {
    return (
      <>
        {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
        <Section>
          <Article>{parse(page.content.rendered)}</Article>
        </Section>
      </>
    );
  }

  // If blog posts are set as front page
  return (
    <Section>
      <div className="flex flex-col gap-8">

        {posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
              >
                View All Posts
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No posts available.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
