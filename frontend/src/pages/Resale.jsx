import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useResale } from '../context/ResaleContext.jsx';

export default function Resale() {
  const { lang, t, formatPrice } = useLanguage();
  const { user } = useAuth();
  const { listings, createListing, buyListing, COMMISSION_PERCENT, MAX_MARKUP_PERCENT } = useResale();

  const [form, setForm] = useState({ name: '', price: '', markup: 20 });
  const [lastPurchase, setLastPurchase] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name || !form.price) return;
    createListing({ ru: form.name, uz: form.name, en: form.name }, user.fullName, Number(form.price), Number(form.markup));
    setForm({ name: '', price: '', markup: 20 });
  };

  const handleBuy = (id) => {
    const result = buyListing(id);
    if (result) setLastPurchase(result);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t('resale.title')}</h1>
        <p>{t('resale.subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, marginTop: 30, marginBottom: 60 }}>
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>{t('resale.sell')}</h3>
          {!user && <p style={{ color: 'var(--color-ink-soft)', fontSize: 14 }}>Войдите, чтобы выставить лот.</p>}
          {user && (
            <form onSubmit={handleCreate} className="auth-card" style={{ padding: 24 }}>
              <div className="field">
                <label>Название препарата</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="field">
                <label>Цена покупки (сум)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="field">
                <label>{t('resale.maxMarkup')} (макс. {MAX_MARKUP_PERCENT}%)</label>
                <input type="number" max={MAX_MARKUP_PERCENT} value={form.markup} onChange={(e) => setForm({ ...form, markup: e.target.value })} />
              </div>
              {form.price && (
                <div className="payout-breakdown">
                  {t('resale.commission')}: {COMMISSION_PERCENT}% <br />
                  {t('resale.yourPayout')}: {formatPrice(Math.round(Number(form.price) * (1 + Math.min(form.markup, MAX_MARKUP_PERCENT) / 100) * (1 - COMMISSION_PERCENT / 100)))}
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 16 }}>{t('resale.sell')}</button>
            </form>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>{t('nav.resale')}</h3>
          {lastPurchase && (
            <div className="payout-breakdown" style={{ marginBottom: 16 }}>
              ✓ Покупка успешна — {formatPrice(lastPurchase.total)}. {t('resale.commission')}: {formatPrice(lastPurchase.commission)}, продавцу: {formatPrice(lastPurchase.payout)}
            </div>
          )}
          {listings.filter((l) => l.status === 'listed' || l.status === 'sold').map((l) => (
            <div className="resale-card" key={l.id}>
              <div className="resale-info">
                <div style={{ fontWeight: 800 }}>{l.productName[lang]}</div>
                <small>{t('resale.seller')}: {l.seller}</small>
                <div style={{ fontWeight: 700, marginTop: 4 }}>{formatPrice(l.resalePriceUZS)}</div>
              </div>
              <div>
                {l.status === 'listed' ? (
                  <button className="btn btn-primary" onClick={() => handleBuy(l.id)}>{t('resale.buy')}</button>
                ) : (
                  <span className="status-pill sold">SOLD</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
