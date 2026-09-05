import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Preorder() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const rareProducts = products.filter((p) => p.isRare);

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t('nav.preorder')}</h1>
        <p>
          Некоторых дефицитных препаратов нет в наличии — мы бронируем их у поставщика и сообщаем,
          как только они поступят на склад.
        </p>
      </div>

      <div className="product-grid" style={{ marginTop: 24, marginBottom: 40 }}>
        {rareProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {submitted && (
        <div className="payout-breakdown" style={{ maxWidth: 480 }}>
          ✓ Ваш предзаказ принят. Мы свяжемся с вами, как только препарат будет забронирован у поставщика.
        </div>
      )}
      {!submitted && (
        <button className="btn btn-primary" onClick={() => setSubmitted(true)}>
          {t('product.preorder')}
        </button>
      )}
    </div>
  );
}
