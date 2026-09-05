import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { products, heroSlides } from '../data/products.js';
import MedBox from './MedBox.jsx';

const BACKGROUNDS = [
  'linear-gradient(135deg,#F5813A 0%,#C4451C 55%,#5E200D 100%)',
  'linear-gradient(135deg,#4A7BF0 0%,#2647B0 55%,#101E5C 100%)',
  'linear-gradient(135deg,#4CAE68 0%,#237A3C 55%,#0E3A1C 100%)',
];

// Автоматически прокручивающийся баннер, как в популярных маркетплейсах.
export default function HeroCarousel() {
  const { t, formatPrice } = useLanguage();
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % heroSlides.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);

  const slide = heroSlides[index];
  const product = products.find((p) => p.id === slide.productId);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-card" style={{ background: BACKGROUNDS[index % BACKGROUNDS.length] }}>
          <button className="hero-arrow prev" onClick={prev} aria-label="prev">‹</button>
          <button className="hero-arrow next" onClick={next} aria-label="next">›</button>

          <div>
            <span className="hero-eyebrow">✚ PharmaExpress</span>
            <h1>{t('hero.title1')}<br />{t('hero.title2')}</h1>
            <p className="subtitle">{t('hero.subtitle')}</p>
            <div className="hero-ctas">
              <Link to="/catalog" className="btn btn-light">{t('hero.cta1')} →</Link>
              <Link to="/profile" className="btn btn-outline-light">{t('hero.cta2')} ⬆</Link>
            </div>
            <div className="hero-dots">
              {heroSlides.map((s, i) => (
                <span key={s.id} className={`hero-dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} />
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <MedBox color={product ? product.accent : '#ffffff'} size={230} shape={product ? product.shape : 'box'} dosageLabel={product ? product.dosage : ''} />
            {product && (
              <div className="hero-price-card">
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                  {product.name.ru} {product.dosage}
                </div>
                <div className="price">{formatPrice(product.priceUZS)}</div>
                {product.oldPriceUZS && <div className="old-price">{formatPrice(product.oldPriceUZS)}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
