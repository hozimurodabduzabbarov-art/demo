import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import MedBox from './MedBox.jsx';

export default function ProductCard({ product }) {
  const { lang, t, formatPrice } = useLanguage();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const outOfStock = product.stock === 0 && !product.isRare;
  const unitLabel = t(`product.${product.unitLabel}`);
  const favorited = isFavorite(product.id);

  return (
    <div className="product-card">
      {product.isRare && <span className="product-badge rare">{t('product.rare')}</span>}
      {!product.isRare && product.oldPriceUZS && <span className="product-badge">-{Math.round((1 - product.priceUZS / product.oldPriceUZS) * 100)}%</span>}

      <button
        className="favorite-btn"
        onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
        title={favorited ? (lang === 'ru' ? 'Убрать из избранного' : lang === 'uz' ? "Sevimlilardan olib tashlash" : 'Remove from favorites') : (lang === 'ru' ? 'В избранное' : lang === 'uz' ? 'Sevimlilarga qo\u2018shish' : 'Add to favorites')}
      >
        {favorited ? '❤️' : '🤍'}
      </button>

      <Link to={`/product/${product.id}`}>
        <div className="product-thumb" style={{ background: `radial-gradient(circle at 50% 40%, ${product.accent}22 0%, ${product.accent}0A 65%, transparent 100%)` }}>
          <MedBox color={product.accent} size={104} shape={product.shape} dosageLabel={product.dosage} />
        </div>
        <div className="product-name">{product.name[lang]}</div>
        <div className="product-meta">{product.dosage} · {product.unitCount} {unitLabel}</div>
      </Link>

      <div className="product-price-row">
        <span className="product-price">{formatPrice(product.priceUZS)}</span>
        {product.oldPriceUZS && <span className="product-old-price">{formatPrice(product.oldPriceUZS)}</span>}
      </div>

      {product.isRare ? (
        <Link to={`/product/${product.id}`} className="product-buy-btn">⭐ {t('product.preorder')}</Link>
      ) : (
        <button className={`product-buy-btn ${outOfStock ? 'disabled' : ''}`} disabled={outOfStock} onClick={() => addItem(product, product.variants ? product.variants[0].color : null)}>
          🛒 {outOfStock ? t('product.outOfStock') : t('product.addToCart')}
        </button>
      )}
    </div>
  );
}
