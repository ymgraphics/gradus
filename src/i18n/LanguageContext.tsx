"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "../i18n-config";
import { useRouter, usePathname } from "next/navigation";

interface LanguageContextType {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (key) => key,
});

type TranslationNode = string | { [key: string]: TranslationNode };

export const LanguageProvider = ({ 
  children, 
  initialDictionary,
  locale
}: { 
  children: React.ReactNode;
  initialDictionary: Record<string, any>;
  locale: Locale;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [dict, setDict] = useState<Record<string, any>>(initialDictionary);

  // Sync dictionary if server prop changes
  useEffect(() => {
    setDict(initialDictionary);
  }, [initialDictionary]);

  const setLang = (newLang: Locale) => {
    // If the language changes, we must redirect to the new locale route
    if (newLang === locale) return;
    
    // We replace the current locale in the pathname
    // e.g. /fr/about -> /en/about
    const segments = pathname.split('/');
    if (segments[1] === locale) {
      segments[1] = newLang;
    } else {
      // fallback just in case
      return router.push(`/${newLang}`);
    }
    router.push(segments.join('/'));
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let result: TranslationNode = dict;
    
    for (const k of keys) {
      if (typeof result === "object" && result[k] !== undefined) {
        result = result[k];
      } else {
        return key; // Fallback to key if translation missing
      }
    }
    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ lang: locale, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
