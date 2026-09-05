import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Favorites() {
  const { lang } = useLanguage();
  const { favoriteIds } = useFavorites();
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="container">
      <div className="page-header">
        <h1>❤️ {lang === 'ru' ? 'Избранное' : lang === 'uz' ? 'Sevimlilar' : 'Favorites'}</h1>
        <p>
          {lang === 'ru' ? 'Препараты, которые вы сохранили, чтобы не искать заново.' : lang === 'uz' ? "Qayta qidirmaslik uchun saqlab qo\u2018ygan dorilaringiz." : 'Medicines you saved so you don\u2019t have to search again.'}
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--color-ink-soft)' }}>
          <p style={{ fontSize: 40, marginBottom: 14 }}>🤍</p>
          <p style={{ marginBottom: 18 }}>
            {lang === 'ru' ? 'Пока пусто — нажимайте на сердечко на карточке товара.' : lang === 'uz' ? "Hozircha bo\u2018sh — mahsulot kartasidagi yurakchani bosing." : 'Nothing here yet — tap the heart on any product card.'}
          </p>
          <Link to="/catalog" className="btn btn-primary">
            {lang === 'ru' ? 'В каталог' : lang === 'uz' ? 'Katalogga' : 'Go to catalog'}
          </Link>
        </div>
      ) : (
        <div className="product-grid" style={{ marginTop: 24, marginBottom: 60 }}>
          {favoriteProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
