"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "th" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const STORAGE_KEY = "egis_mu_lang_th_default";

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("th");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "th" || saved === "en") {
      setLangState(saved);
    } else {
      setLangState("th");
      localStorage.setItem(STORAGE_KEY, "th");
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function TranslatedText({ th, en }: { th: string; en: string }) {
  const { lang } = useLanguage();
  return <>{lang === "th" ? th : en}</>;
}
