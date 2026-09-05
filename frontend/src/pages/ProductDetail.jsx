import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';
import MedBox from '../components/MedBox.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t, formatPrice } = useLanguage();
  const { addItem } = useCart();

  const product = products.find((p) => p.id === id);
  const [variant, setVariant] = useState(product?.variants ? product.variants[0] : null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return <div className="container" style={{ padding: 60 }}>Not found</div>;

  const bg = variant ? variant.bg : `linear-gradient(135deg, ${product.accent}, #2a1a10)`;
  const outOfStock = product.stock === 0 && !product.isRare;

  const handleAdd = () => {
    addItem(product, variant?.color, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-detail-visual" style={{ background: bg }}>
          <MedBox color={variant ? variant.hex : product.accent} size={220} shape={product.shape} dosageLabel={product.dosage} />
          {product.prescriptionRequired && (
            <span className="product-badge" style={{ position: 'absolute', top: 24, left: 24 }}>
              ℞ {t('product.prescriptionRequired')}
            </span>
          )}
        </div>

        <div>
          <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 6 }}>{product.name[lang]}</h1>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 14.5 }}>
            {product.dosage} · {product.unitCount} {t(`product.${product.unitLabel}`)}
          </p>

          <div className="detail-price">{formatPrice(product.priceUZS)}</div>
          {product.oldPriceUZS && <div className="product-old-price" style={{ fontSize: 15 }}>{formatPrice(product.oldPriceUZS)}</div>}

          {product.variants && (
            <>
              <p style={{ fontWeight: 700, fontSize: 13.5, marginTop: 24, marginBottom: 4 }}>{t('product.chooseVariant')}</p>
              <div className="variant-row">
                {product.variants.map((v) => (
                  <div
                    key={v.color}
                    className={`variant-swatch ${variant?.color === v.color ? 'selected' : ''}`}
                    style={{ background: v.hex }}
                    title={v.label[lang]}
                    onClick={() => setVariant(v)}
                  />
                ))}
              </div>
            </>
          )}

          {!product.isRare && (
            <div className="qty-row">
              <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span style={{ fontWeight: 800, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          )}

          {product.isRare ? (
            <button className="btn btn-primary btn-block" onClick={() => navigate('/preorder')}>
              ⭐ {t('product.preorder')}
            </button>
          ) : (
            <button className="btn btn-primary btn-block" disabled={outOfStock} onClick={handleAdd}>
              🛒 {outOfStock ? t('product.outOfStock') : justAdded ? '✓' : t('product.addToCart')}
            </button>
          )}

          {justAdded && (
            <p style={{ marginTop: 12, color: 'var(--color-success)', fontWeight: 700, fontSize: 13.5 }}>
              <Link to="/cart" style={{ textDecoration: 'underline' }}>{t('cart.title')} →</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
