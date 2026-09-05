import { Navigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { t, formatPrice } = useLanguage();
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container" style={{ padding: '48px 0 80px', maxWidth: 640 }}>
      <div className="auth-card" style={{ maxWidth: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>
            {user.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{user.fullName}</div>
            <div style={{ color: 'var(--color-ink-soft)', fontSize: 13.5 }}>{user.phone}</div>
          </div>
        </div>

        <div className="summary-row"><span>Роль</span><span>{user.role}</span></div>
        <div className="summary-row total"><span>Баланс (от перепродажи)</span><span>{formatPrice(user.balance || 0)}</span></div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <Link to="/catalog" className="btn btn-primary" style={{ flex: 1 }}>{t('cart.continue')}</Link>
          <button className="btn" style={{ flex: 1, background: 'var(--color-line)' }} onClick={logout}>{t('auth.logout')}</button>
        </div>
      </div>
    </div>
  );
}
