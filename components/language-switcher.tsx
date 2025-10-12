'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supportedLanguages, SupportedLanguage } from '../middleware';
import { languageConfig, getLanguageFromPathname, addLanguagePrefix, removeLanguagePrefix } from '../lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = getLanguageFromPathname(pathname);

  const handleLanguageChange = (language: SupportedLanguage) => {
    const cleanPath = removeLanguagePrefix(pathname);
    const newPath = addLanguagePrefix(cleanPath, language);

    setIsOpen(false);
    router.push(newPath);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-slate-200 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languageConfig[currentLanguage].flag}</span>
        <span>{languageConfig[currentLanguage].nativeName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-slate-200">
            <div className="py-1" role="menu">
              {supportedLanguages.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageChange(language)}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-blue-50 ${
                    currentLanguage === language
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-900'
                  }`}
                  role="menuitem"
                >
                  <span>{languageConfig[language].flag}</span>
                  <span>{languageConfig[language].nativeName}</span>
                  {currentLanguage === language && (
                    <svg
                      className="w-4 h-4 ml-auto text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}