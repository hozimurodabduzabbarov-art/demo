import { useLanguage } from '../../context/LanguageContext.jsx';
import { useResale } from '../../context/ResaleContext.jsx';

export default function AdminResale() {
  const { t, lang, formatPrice } = useLanguage();
  const { listings, reviewListing, COMMISSION_PERCENT } = useResale();

  const pending = listings.filter((l) => l.status === 'pending_review');
  const reviewed = listings.filter((l) => l.status !== 'pending_review');

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>{t('admin.resaleModeration')}</h2>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 13.5, marginBottom: 20 }}>
        Комиссия аптеки с каждой сделки: {COMMISSION_PERCENT}%. Новые лоты требуют подтверждения
        перед публикацией на витрине — это защищает от спекуляции дефицитом.
      </p>

      <h3 style={{ fontSize: 15, marginBottom: 10 }}>Ожидают модерации ({pending.length})</h3>
      {pending.length === 0 && <p style={{ color: 'var(--color-ink-soft)', fontSize: 13.5, marginBottom: 24 }}>Нет лотов на проверке.</p>}
      {pending.length > 0 && (
        <table className="admin-table" style={{ marginBottom: 32 }}>
          <thead><tr><th>Препарат</th><th>Продавец</th><th>Цена покупки</th><th>Цена перепродажи</th><th>Наценка</th><th></th></tr></thead>
          <tbody>
            {pending.map((l) => {
              const markup = Math.round(((l.resalePriceUZS - l.purchasePriceUZS) / l.purchasePriceUZS) * 100);
              return (
                <tr key={l.id}>
                  <td style={{ fontWeight: 700 }}>{l.productName[lang]}</td>
                  <td>{l.seller}</td>
                  <td>{formatPrice(l.purchasePriceUZS)}</td>
                  <td>{formatPrice(l.resalePriceUZS)}</td>
                  <td>+{markup}%</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" style={{ padding: '7px 14px', background: '#E3F4E7', color: '#237A3C', fontSize: 12.5 }} onClick={() => reviewListing(l.id, 'listed')}>
                      {t('admin.approve')}
                    </button>
                    <button className="btn" style={{ padding: '7px 14px', background: '#FCE9E4', color: '#B33A1E', fontSize: 12.5 }} onClick={() => reviewListing(l.id, 'rejected')}>
                      {t('admin.reject')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h3 style={{ fontSize: 15, marginBottom: 10 }}>История</h3>
      <table className="admin-table">
        <thead><tr><th>Препарат</th><th>Продавец</th><th>Цена</th><th>Статус</th></tr></thead>
        <tbody>
          {reviewed.map((l) => (
            <tr key={l.id}>
              <td style={{ fontWeight: 700 }}>{l.productName[lang]}</td>
              <td>{l.seller}</td>
              <td>{formatPrice(l.resalePriceUZS)}</td>
              <td><span className={`status-pill ${l.status}`}>{l.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
