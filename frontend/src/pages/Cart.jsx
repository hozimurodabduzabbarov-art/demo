import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { products } from '../data/products.js';
import MedBox from '../components/MedBox.jsx';

export default function Cart() {
  const { lang, t, formatPrice } = useLanguage();
  const { items, removeItem, updateQuantity, totalUZS, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    clearCart();
    navigate('/tracking'); // после оформления заказа сразу показываем live-отслеживание курьера
  };

  return (
    <div className="container cart-page">
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 22 }}>{t('cart.title')}</h1>
        {items.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-ink-soft)' }}>
            <p style={{ marginBottom: 16 }}>{t('cart.empty')}</p>
            <Link to="/catalog" className="btn btn-primary">{t('cart.continue')}</Link>
          </div>
        )}
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return (
            <div className="cart-line" key={item.key}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: `${item.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MedBox color={item.accent} size={44} shape={item.shape} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{item.name[lang]}</div>
                {item.variantColor && <div style={{ fontSize: 12.5, color: 'var(--color-ink-soft)' }}>{item.variantColor}</div>}
                <div style={{ fontWeight: 700, marginTop: 4 }}>{formatPrice(item.priceUZS)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.key)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: 13 }}>
                {t('cart.remove')}
              </button>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="cart-summary">
          <div className="summary-row"><span>{t('cart.title')}</span><span>{items.length}</span></div>
          <div className="summary-row total"><span>{t('cart.total')}</span><span>{formatPrice(totalUZS)}</span></div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={handleCheckout}>
            {t('cart.checkout')}
          </button>
        </div>
      )}
    </div>
  );
}
