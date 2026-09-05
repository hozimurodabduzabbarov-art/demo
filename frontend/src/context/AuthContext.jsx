import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Мок-аутентификация для демо без запущенного backend.
// В боевом режиме эти функции должны звать POST /api/auth/login и /api/auth/signup.
const AuthContext = createContext(null);

const STORAGE_KEY = 'pharmaexpress_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else sessionStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(({ phone, password }) => {
    if (!phone || !password) throw new Error('Введите телефон и пароль');
    const u = { id: 'u_' + phone, fullName: phone, phone, role: phone === '+998900000000' ? 'admin' : 'user', balance: 0 };
    persist(u);
    return u;
  }, []);

  const signup = useCallback(({ fullName, phone, password }) => {
    if (!fullName || !phone || !password) throw new Error('Заполните все поля');
    const u = { id: 'u_' + phone, fullName, phone, role: 'user', balance: 0 };
    persist(u);
    return u;
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
