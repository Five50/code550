import { Breadcrumbs } from "@/components/breadcrumbs";
import { WPContent } from "@/lib/wp-content-renderer";

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  content: string;
  breadcrumbLabel: string;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* Fallback content shown when WordPress has no page for this slug.
   This is hardcoded trusted content, not user input. */
const fallbackContent: Record<string, string> = {
  "Privacy Policy": `
    <h2>Introduction</h2>
    <p>Code550 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
    <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.</p>

    <h2>Information We Collect</h2>
    <h3>Personal Information</h3>
    <p>We may collect personal information that you voluntarily provide to us when you:</p>
    <ul>
      <li>Fill out contact forms or request consultations</li>
      <li>Subscribe to our newsletter</li>
      <li>Engage with our services or submit project inquiries</li>
      <li>Communicate with us via email or other channels</li>
    </ul>
    <p>This information may include: name, email address, phone number, company name, project details, and any other information you choose to provide.</p>

    <h3>Automatically Collected Information</h3>
    <p>When you visit our website, we automatically collect certain information about your device and browsing behavior, including:</p>
    <ul>
      <li>IP address and location data</li>
      <li>Browser type and version</li>
      <li>Operating system</li>
      <li>Pages viewed and time spent on pages</li>
      <li>Referring website addresses</li>
      <li>Device type and screen resolution</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <p>We use the information we collect for various purposes, including to:</p>
    <ul>
      <li>Provide, maintain, and improve our services</li>
      <li>Respond to your inquiries and provide customer support</li>
      <li>Send you marketing communications (with your consent)</li>
      <li>Analyze usage patterns and optimize website performance</li>
      <li>Detect, prevent, and address technical issues or fraud</li>
      <li>Comply with legal obligations</li>
    </ul>

    <h2>Cookies and Tracking Technologies</h2>
    <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with small amounts of data that are sent to your browser from a website and stored on your device.</p>
    <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</p>

    <h2>Third-Party Services</h2>
    <p>We may employ third-party companies and services to facilitate our website and services, including:</p>
    <ul>
      <li>Analytics services (e.g., Google Analytics)</li>
      <li>Email marketing platforms</li>
      <li>Customer relationship management (CRM) systems</li>
      <li>Hosting and infrastructure providers</li>
    </ul>
    <p>These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

    <h2>Data Security</h2>
    <p>We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

    <h2>Your Rights</h2>
    <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
    <ul>
      <li>The right to access and receive a copy of your personal data</li>
      <li>The right to rectify inaccurate personal data</li>
      <li>The right to request deletion of your personal data</li>
      <li>The right to restrict or object to processing</li>
      <li>The right to data portability</li>
      <li>The right to withdraw consent at any time</li>
    </ul>
    <p>To exercise these rights, please contact us at privacy@code550.com.</p>

    <h2>Children's Privacy</h2>
    <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.</p>

    <h2>Changes to This Privacy Policy</h2>
    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
    <p>We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
  `,
  "Terms of Service": `
    <h2>Acceptance of Terms</h2>
    <p>By accessing and using Code550's website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

    <h2>Services</h2>
    <p>Code550 provides web development, design, SEO, and digital strategy services. The specific scope of work for any project will be defined in a separate agreement or proposal.</p>

    <h2>Intellectual Property</h2>
    <p>All content on this website, including text, graphics, logos, and software, is the property of Code550 or its content suppliers and is protected by intellectual property laws.</p>
    <p>Upon full payment, clients receive ownership of custom deliverables as specified in the project agreement. Code550 retains the right to showcase completed work in our portfolio unless otherwise agreed.</p>

    <h2>Payment Terms</h2>
    <p>Payment terms are specified in individual project proposals. Generally, projects require a deposit before work begins, with remaining payments due at agreed milestones.</p>

    <h2>Limitation of Liability</h2>
    <p>Code550 shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or any related matter.</p>

    <h2>Termination</h2>
    <p>Either party may terminate a project agreement with written notice, subject to the terms specified in the project proposal or contract.</p>

    <h2>Governing Law</h2>
    <p>These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.</p>

    <h2>Changes to Terms</h2>
    <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website.</p>
  `,
  "Cookie Policy": `
    <h2>What Are Cookies</h2>
    <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide reporting information.</p>

    <h2>How We Use Cookies</h2>
    <p>We use cookies for several purposes, including:</p>
    <ul>
      <li><strong>Essential Cookies:</strong> Required for the website to function properly, such as session management and security.</li>
      <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
      <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences.</li>
      <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</li>
    </ul>

    <h2>Third-Party Cookies</h2>
    <p>Some cookies are placed by third-party services that appear on our pages. We use services such as Google Analytics, which set their own cookies to help us analyze web traffic.</p>

    <h2>Managing Cookies</h2>
    <p>You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and some functionality may no longer be available.</p>
    <p>Most browsers allow you to view, manage, delete, and block cookies. Be aware that if you delete all cookies, any preferences you have set will be lost.</p>

    <h2>Changes to This Cookie Policy</h2>
    <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
  `,
};

export function LegalPage({ title, lastUpdated, content, breadcrumbLabel }: LegalPageProps) {
  const displayDate = lastUpdated ? formatDate(lastUpdated) : "March 6, 2026";
  // Content source: WordPress CMS (trusted) or hardcoded fallback (also trusted)
  const displayContent = content || fallbackContent[title] || "";

  return (
    <div className="min-h-screen pt-24">
      <article>
        {/* Header with Breadcrumbs */}
        <section className="py-12 border-b border-border/50 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <Breadcrumbs items={[{ label: breadcrumbLabel }]} />

            <div className="max-w-4xl mx-auto">
              <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl mb-4">
                {title}
              </h1>
              <p className="text-muted-foreground text-lg">
                Last updated: {displayDate}
              </p>
            </div>
          </div>
        </section>

        {/* Content - Sources: WordPress CMS content or hardcoded fallback, both trusted */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto prose prose-invert">
              <div className="space-y-12">
                <WPContent
                  html={displayContent}
                  className="[&>h2]:font-[family-name:var(--font-display)] [&>h2]:text-3xl [&>h2]:mb-4 [&>h3]:font-[family-name:var(--font-display)] [&>h3]:text-xl [&>h3]:mb-3 [&>h3]:mt-6 [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mt-4 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-2 [&>ul]:text-muted-foreground [&>ul]:ml-4 [&>ul]:mt-4"
                />

                {/* Contact Box */}
                <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl mb-4">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this {title}, please contact us:
                  </p>
                  <ul className="space-y-2 text-muted-foreground mt-4">
                    <li>Email: <a href="mailto:privacy@code550.com" className="text-primary hover:underline">privacy@code550.com</a></li>
                    <li>Phone: <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a></li>
                    <li>Address: San Francisco, CA</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
