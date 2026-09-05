import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { products, categories } from '../data/products.js';
import HeroCarousel from '../components/HeroCarousel.jsx';
import BadgesStrip from '../components/BadgesStrip.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      <HeroCarousel />
      <BadgesStrip />

      <div className="container">
        <div className="category-strip">
          <button className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
            ✨ {lang === 'ru' ? 'Все' : lang === 'uz' ? 'Barchasi' : 'All'}
          </button>
          {categories.map((c) => (
            <button key={c.slug} className={`category-pill ${activeCategory === c.slug ? 'active' : ''}`} onClick={() => setActiveCategory(c.slug)}>
              {c.icon} {c.name[lang]}
            </button>
          ))}
        </div>

        <div className="section-head">
          <h2>{t('nav.medicines')}</h2>
          <Link to="/catalog" className="see-all">{lang === 'ru' ? 'Смотреть все →' : lang === 'uz' ? "Hammasini ko'rish →" : 'See all →'}</Link>
        </div>
        <div className="product-rail">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
