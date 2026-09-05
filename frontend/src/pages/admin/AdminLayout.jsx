import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function AdminLayout() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: 80, textAlign: 'center' }}>
        <p>Доступ только для администратора.</p>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: 13.5, marginTop: 8 }}>
          Демо-подсказка: войдите под номером <b>+998900000000</b>, чтобы получить роль администратора.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 26 }}>✚ Admin</div>
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>{t('admin.products')}</NavLink>
        <NavLink to="/admin/sales" className={({ isActive }) => (isActive ? 'active' : '')}>{t('admin.sales')}</NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>{t('admin.orders')}</NavLink>
        <NavLink to="/admin/resale" className={({ isActive }) => (isActive ? 'active' : '')}>{t('admin.resaleModeration')}</NavLink>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
