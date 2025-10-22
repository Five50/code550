'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface TemplateUpdaterProps {
  initialTemplate: string;
}

export function TemplateUpdater({ initialTemplate }: TemplateUpdaterProps) {
  const pathname = usePathname();

  useEffect(() => {
    async function updateTemplate() {
      try {
        // Call an API route to get the template for the current path
        const response = await fetch(`/api/template?path=${encodeURIComponent(pathname)}`);
        if (response.ok) {
          const data = await response.json();
          document.body.setAttribute('data-template', data.template);
        }
      } catch (error) {
        console.error('Error updating template:', error);
      }
    }

    updateTemplate();
  }, [pathname]);

  return null;
}
