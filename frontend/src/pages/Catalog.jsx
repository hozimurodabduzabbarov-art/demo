import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { products, categories } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Catalog() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesQuery = p.name[lang].toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, lang]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t('nav.catalog')}</h1>
        <p>{t('hero.subtitle')}</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          style={{ width: '100%', maxWidth: 480, padding: '14px 20px', borderRadius: 999, border: '1.5px solid var(--color-line)', fontSize: 14.5 }}
        />
      </div>

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

      <div className="product-grid" style={{ marginTop: 24, marginBottom: 60 }}>
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        {filtered.length === 0 && <p style={{ color: 'var(--color-ink-soft)' }}>—</p>}
      </div>
    </div>
  );
}
