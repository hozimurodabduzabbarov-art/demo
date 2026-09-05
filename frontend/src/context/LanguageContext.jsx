import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import ru from '../i18n/ru.json';
import uz from '../i18n/uz.json';
import en from '../i18n/en.json';

const DICTS = { ru, uz, en };

// Валюта автоматически следует за языком: RU -> RUB, UZ -> UZS, EN -> USD.
const LANG_TO_CURRENCY = { ru: 'RUB', uz: 'UZS', en: 'USD' };
const CURRENCY_SYMBOL = { RUB: '₽', UZS: "so'm", USD: '$' };

// Курсы по данным Центробанка Узбекистана на 25.08.2026 (cbu.uz):
// 1 USD = 11 818.07 UZS · 1 RUB = 141.69 UZS
// В боевой версии эти значения нужно обновлять по расписанию (cron) через API ЦБ.
const RATES_FROM_UZS = { UZS: 1, RUB: 1 / 141.69, USD: 1 / 11818.07 };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ru');
  const [currency, setCurrency] = useState(LANG_TO_CURRENCY['ru']);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    setCurrency(LANG_TO_CURRENCY[newLang]); // язык переключает валюту автоматически
  }, []);

  const t = useCallback(
    (path) => {
      const parts = path.split('.');
      let node = DICTS[lang];
      for (const p of parts) node = node?.[p];
      return node ?? path;
    },
    [lang]
  );

  const formatPrice = useCallback(
    (priceInUZS) => {
      const rate = RATES_FROM_UZS[currency] ?? 1;
      const value = priceInUZS * rate;
      const rounded = currency === 'UZS' ? Math.round(value) : Math.round(value * 100) / 100;
      const formatted = rounded.toLocaleString(lang === 'ru' ? 'ru-RU' : lang === 'uz' ? 'uz-UZ' : 'en-US');
      const symbol = CURRENCY_SYMBOL[currency];
      return currency === 'USD' ? `$${formatted}` : `${formatted} ${symbol}`;
    },
    [currency, lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, currency, setCurrency, t, formatPrice }),
    [lang, setLang, currency, t, formatPrice]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
