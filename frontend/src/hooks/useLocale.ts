import { useMemo } from 'react';
import { translations, type TranslationKey, type Locale } from '../locales/translations';

function getLocaleFromBrowser(): Locale {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('es')) {
    return 'es';
  }
  return 'en';
}

function getLocaleFromQuery(): Locale | null {
  const params = new URLSearchParams(window.location.search);
  const localeParam = params.get('l');
  if (localeParam === 'es') {
    return 'es';
  }
  if (localeParam === 'en') {
    return 'en';
  }
  return null;
}

export function useLocale() {
  const locale = useMemo<Locale>(() => {
    const queryLocale = getLocaleFromQuery();
    if (queryLocale) {
      return queryLocale;
    }
    return getLocaleFromBrowser();
  }, []);

  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      return translations[locale][key];
    };
  }, [locale]);

  return { locale, t };
}
