import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Избранное — список любимых препаратов пользователя, сохраняется между визитами (localStorage).
const FavoritesContext = createContext(null);
const STORAGE_KEY = 'pharmaexpress_favorites';

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = useCallback((productId) => {
    setFavoriteIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const isFavorite = useCallback((productId) => favoriteIds.includes(productId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
