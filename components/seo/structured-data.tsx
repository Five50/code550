interface StructuredDataProps {
  schema: string;
}

export function StructuredData({ schema }: StructuredDataProps) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}