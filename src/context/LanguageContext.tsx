import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { dictionary, type Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('selected_language');
    if (saved === 'HI' || saved === 'CG' || saved === 'EN') return saved;
    return 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selected_language', lang);
    applyGoogleTranslateCookie(lang);
  };

  const applyGoogleTranslateCookie = (lang: Language) => {
    const targetLangCode = lang === 'HI' ? 'hi' : lang === 'CG' ? 'hi' : 'en';
    const domain = window.location.hostname;
    
    document.cookie = `googtrans=/en/${targetLangCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${targetLangCode}; path=/;`;

    // Trigger google translate select element if present
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = targetLangCode;
      combo.dispatchEvent(new Event('change'));
    } else {
      window.dispatchEvent(new Event('languageChange'));
    }
  };

  useEffect(() => {
    // Inject Google Translate script dynamically if not present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false },
            'google_translate_element'
          );
        }
      };
    }
  }, []);

  const t = (key: string, defaultText?: string): string => {
    const slugKey = key.toLowerCase().trim();
    if (dictionary[slugKey] && dictionary[slugKey][language]) {
      return dictionary[slugKey][language];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div id="google_translate_element" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
