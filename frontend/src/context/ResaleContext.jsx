import { createContext, useContext, useState, useCallback } from 'react';

// Хранит лоты перепродажи в памяти на клиенте для демонстрации без backend.
const ResaleContext = createContext(null);

const COMMISSION_PERCENT = 15; // 10-20%, в реальной системе настраивается админом
const MAX_MARKUP_PERCENT = 30;

export function ResaleProvider({ children }) {
  const [listings, setListings] = useState([
    {
      id: 'demo-listing-1',
      productName: { ru: 'Иматиниб 400 мг', uz: 'Imatinib 400 mg', en: 'Imatinib 400 mg' },
      seller: 'Aziz K.',
      purchasePriceUZS: 4200000,
      resalePriceUZS: 4600000,
      status: 'listed',
    },
    {
      id: 'demo-listing-2',
      productName: { ru: 'Инсулин гларгин', uz: 'Insulin glargin', en: 'Insulin glargine' },
      seller: 'Dilnoza Y.',
      purchasePriceUZS: 890000,
      resalePriceUZS: 990000,
      status: 'pending_review',
    },
  ]);

  const createListing = useCallback((productName, seller, purchasePriceUZS, markupPercent) => {
    const markup = Math.min(markupPercent, MAX_MARKUP_PERCENT);
    const resalePriceUZS = Math.round(purchasePriceUZS * (1 + markup / 100));
    const listing = {
      id: 'listing_' + Date.now(),
      productName,
      seller,
      purchasePriceUZS,
      resalePriceUZS,
      status: 'listed',
    };
    setListings((prev) => [listing, ...prev]);
    return listing;
  }, []);

  const buyListing = useCallback((id) => {
    let result = null;
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === id && l.status === 'listed') {
          const commission = Math.round(l.resalePriceUZS * (COMMISSION_PERCENT / 100));
          result = { commission, payout: l.resalePriceUZS - commission, total: l.resalePriceUZS };
          return { ...l, status: 'sold' };
        }
        return l;
      })
    );
    return result;
  }, []);

  // Модерация лота администратором: одобрить ('listed') или отклонить ('rejected').
  const reviewListing = useCallback((id, decision) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: decision } : l)));
  }, []);

  return (
    <ResaleContext.Provider value={{ listings, createListing, buyListing, reviewListing, COMMISSION_PERCENT, MAX_MARKUP_PERCENT }}>
      {children}
    </ResaleContext.Provider>
  );
}

export function useResale() {
  const ctx = useContext(ResaleContext);
  if (!ctx) throw new Error('useResale must be used within ResaleProvider');
  return ctx;
}
