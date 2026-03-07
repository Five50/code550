import { Section, Article } from "@/components/craft";
import { WPContent } from "@/lib/wp-content-renderer";

interface PageTemplateProps {
  page: any;
  styles?: string;
}

/**
 * Page template - Default template for WordPress pages
 * Matches WordPress "page" template
 */
export function PageTemplate({ page, styles }: PageTemplateProps) {
  if (!page || !page.content || !page.content.rendered) {
    return null;
  }

  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <Section>
        {/* Page Content */}
        <Article><WPContent html={page.content.rendered} /></Article>
      </Section>
    </>
  );
}
