import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { productId, variantColor, quantity, priceUZS, name, image }

  const addItem = useCallback((product, variantColor, quantity = 1) => {
    setItems((prev) => {
      const key = product.id + '_' + (variantColor || 'default');
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantColor: variantColor || null,
          quantity,
          priceUZS: product.priceUZS,
          name: product.name,
          accent: product.accent,
          shape: product.shape,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalUZS = useMemo(() => items.reduce((sum, i) => sum + i.priceUZS * i.quantity, 0), [items]);
  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = { items, addItem, removeItem, updateQuantity, clearCart, totalUZS, totalCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
