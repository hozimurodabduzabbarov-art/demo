import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const LANGS = [
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'uz', flag: '🇺🇿', label: "O'zbekcha" },
  { code: 'en', flag: '🇬🇧', label: 'English' },
];

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const { favoriteIds } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState(null); // 'lang' | 'user' | null
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <header className="header">
      <div className="container header-inner" ref={ref}>
        <Link to="/" className="brand">
          <span className="brand-mark">✚</span> PharmaExpress
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.medicines')}</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.catalog')}</NavLink>
          <NavLink to="/delivery" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.delivery')}</NavLink>
          <NavLink to="/preorder" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.preorder')}</NavLink>
          <NavLink to="/resale" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.resale')}</NavLink>
          <NavLink to="/symptom-checker" className={({ isActive }) => (isActive ? 'active' : '')}>✨ {t('nav.symptomChecker')}</NavLink>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link to="/favorites" className="icon-btn" title="Favorites">
            ❤️
            {favoriteIds.length > 0 && <span className="cart-badge">{favoriteIds.length}</span>}
          </Link>

          <Link to="/cart" className="icon-btn" title={t('cart.title')}>
            🛒
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>

          <div className="dropdown-wrap">
            <button className="icon-btn" onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}>👤</button>
            {openMenu === 'user' && (
              <div className="dropdown-panel">
                {user ? (
                  <>
                    <div className="dropdown-item" style={{ fontWeight: 700 }}>{user.fullName}</div>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setOpenMenu(null)}>Admin Panel</Link>
                    )}
                    <Link to="/profile" className="dropdown-item" onClick={() => setOpenMenu(null)}>Профиль</Link>
                    <div className="dropdown-item" onClick={() => { logout(); setOpenMenu(null); }}>{t('auth.logout')}</div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={() => setOpenMenu(null)}>{t('auth.login')}</Link>
                    <Link to="/signup" className="dropdown-item" onClick={() => setOpenMenu(null)}>{t('auth.signup')}</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="dropdown-wrap">
            <button className="dropdown-btn" onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')}>
              {LANGS.find((l) => l.code === lang)?.flag} {lang.toUpperCase()} ▾
            </button>
            {openMenu === 'lang' && (
              <div className="dropdown-panel">
                {LANGS.map((l) => (
                  <div
                    key={l.code}
                    className={`dropdown-item ${l.code === lang ? 'selected' : ''}`}
                    onClick={() => { setLang(l.code); setOpenMenu(null); }}
                  >
                    <span>{l.flag} {l.label}</span>
                    {l.code === lang && <span>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
