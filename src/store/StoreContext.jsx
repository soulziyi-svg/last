/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);
const CART_KEY = 'ibubom-cart-v2';
const USER_KEY = 'ibubom-user-v2';

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load(CART_KEY, []));
  const [user, setUser] = useState(() => load(USER_KEY, null));
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const addToCart = (product) => {
    setCart((items) => items.some((item) => item.id === product.id)
      ? items.map((item) => item.id === product.id ? { ...item, ...product, qty:product.qty || item.qty || 1, size:product.size || item.size || 'M', period:product.period || item.period || '1박' } : item)
      : [...items, { qty:1, size:'M', period:'1박', accessories:[], ...product }]);
    setToast('✓ 장바구니에 추가되었습니다.');
  };
  const updateCart = (id, patch) => setCart((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const removeFromCart = (id) => setCart((items) => items.filter((item) => item.id !== id));

  const value = useMemo(() => ({
    cart, user, dialog, toast, setDialog, setToast, setUser, addToCart, updateCart, removeFromCart,
  }), [cart, user, dialog, toast]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
