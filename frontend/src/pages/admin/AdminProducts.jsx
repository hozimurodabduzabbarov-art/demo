import { useLanguage } from '../../context/LanguageContext.jsx';
import { products } from '../../data/products.js';

export default function AdminProducts() {
  const { t, lang, formatPrice } = useLanguage();
  return (
    <div>
      <div className="section-head" style={{ margin: '0 0 20px' }}>
        <h2 style={{ fontSize: 22 }}>{t('admin.products')}</h2>
        <button className="btn btn-primary">+ {t('admin.addProduct')}</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Название</th><th>Категория</th><th>Цена</th><th>Остаток</th><th>Статус</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{ fontWeight: 700 }}>{p.name[lang]} · {p.dosage}</td>
              <td>{p.category}</td>
              <td>{formatPrice(p.priceUZS)}</td>
              <td>{p.stock}</td>
              <td>
                {p.stock > 0 ? <span className="status-pill listed">В наличии</span> : <span className="status-pill pending">Нет в наличии</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
