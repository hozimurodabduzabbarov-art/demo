import { useLanguage } from '../context/LanguageContext.jsx';
import { categories } from '../data/products.js';

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span className="brand-mark">✚</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'white' }}>PharmaExpress</span>
            </div>
            <p style={{ fontSize: 13.5, opacity: 0.7, maxWidth: 260, lineHeight: 1.6 }}>{t('hero.subtitle')}</p>
          </div>
          <div>
            <h4>{t('footer.categories')}</h4>
            <ul>{categories.map((c) => <li key={c.slug}>{c.icon} {c.name[lang]}</li>)}</ul>
          </div>
          <div>
            <h4>{t('footer.company')}</h4>
            <ul>
              <li>{t('nav.about')}</li>
              <li>{t('nav.delivery')}</li>
              <li>{t('nav.resale')}</li>
            </ul>
          </div>
          <div>
            <h4>{t('footer.contacts')}</h4>
            <ul>
              <li>📞 +998 90 000-00-00</li>
              <li>✉️ support@pharmaexpress.uz</li>
              <li>📍 Tashkent, Uzbekistan</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PharmaExpress. {t('footer.rights')}</span>
          <span>RU · UZ · EN</span>
        </div>
      </div>
    </footer>
  );
}
