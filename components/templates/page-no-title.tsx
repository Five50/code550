import { Section, Article } from "@/components/craft";
import parse from "html-react-parser";

interface PageNoTitleTemplateProps {
  page: any;
  styles?: string;
}

/**
 * Page No Title template - WordPress page template without title
 * Matches WordPress "page-no-title" template
 */
export function PageNoTitleTemplate({ page, styles }: PageNoTitleTemplateProps) {
  if (!page || !page.content || !page.content.rendered) {
    return null;
  }

  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      <Section>
        {/* Page Content - No Title */}
        <Article>{parse(page.content.rendered)}</Article>
      </Section>
    </>
  );
}
