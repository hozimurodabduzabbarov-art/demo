import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

// Фирменная фишка «умной аптеки»: подбор безрецептурных препаратов по симптомам.
// Правило-ориентированный движок (без реального ИИ/сети) — прозрачно, предсказуемо
// и безопасно для демо: НЕ рекомендует антибиотики и рецептурные препараты напрямую,
// а вместо этого просит обратиться к врачу.

const SYMPTOMS = [
  { key: 'fever', icon: '🌡️', match: ['pain-relief'], label: { ru: 'Температура', uz: 'Harorat', en: 'Fever' } },
  { key: 'headache', icon: '🤕', match: ['pain-relief'], label: { ru: 'Головная боль', uz: "Bosh og'rig'i", en: 'Headache' } },
  { key: 'sore-throat', icon: '🗣️', match: ['cold-flu'], label: { ru: 'Боль в горле', uz: 'Tomoq og\u2018rig\u2018i', en: 'Sore throat' } },
  { key: 'runny-nose', icon: '🤧', match: ['cold-flu'], label: { ru: 'Насморк', uz: 'Tumov', en: 'Runny nose' } },
  { key: 'cough', icon: '😷', match: ['cold-flu'], label: { ru: 'Кашель', uz: 'Yo\u2018tal', en: 'Cough' } },
  { key: 'allergy', icon: '🤧', match: ['allergy'], label: { ru: 'Аллергия / сыпь', uz: 'Allergiya / toshma', en: 'Allergy / rash' } },
  { key: 'stomach', icon: '🤢', match: ['digestive'], label: { ru: 'Боль в желудке', uz: 'Oshqozon og\u2018rig\u2018i', en: 'Stomach ache' } },
  { key: 'heartburn', icon: '🔥', match: ['digestive'], label: { ru: 'Изжога', uz: 'Yurak achishishi', en: 'Heartburn' } },
  { key: 'fatigue', icon: '😴', match: ['vitamins'], label: { ru: 'Слабость / усталость', uz: 'Charchoq', en: 'Fatigue' } },
  { key: 'muscle-pain', icon: '💪', match: ['pain-relief'], label: { ru: 'Мышечная боль', uz: 'Mushak og\u2018rig\u2018i', en: 'Muscle pain' } },
  { key: 'infection-signs', icon: '⚠️', match: [], warnDoctor: true, label: { ru: 'Высокая темп. > 3 дней', uz: '3 kundan ortiq yuqori harorat', en: 'High fever > 3 days' } },
];

export default function SymptomChecker() {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('select'); // select | thinking | result

  const toggle = (key) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const analyze = () => {
    setPhase('thinking');
    setTimeout(() => setPhase('result'), 1400);
  };

  const reset = () => {
    setSelected([]);
    setPhase('select');
  };

  const selectedSymptoms = SYMPTOMS.filter((s) => selected.includes(s.key));
  const needsDoctor = selectedSymptoms.some((s) => s.warnDoctor);
  const matchedCategories = [...new Set(selectedSymptoms.flatMap((s) => s.match))];
  const matchedProducts = products.filter((p) => matchedCategories.includes(p.category) && !p.isRare).slice(0, 6);

  return (
    <div className="container" style={{ padding: '48px 0 90px' }}>
      <div className="page-header">
        <h1>✨ {t('symptomChecker.title')}</h1>
        <p>{t('symptomChecker.subtitle')}</p>
      </div>

      {phase === 'select' && (
        <>
          <h3 style={{ fontSize: 15, margin: '26px 0 14px' }}>{t('symptomChecker.select')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {SYMPTOMS.map((s) => (
              <button
                key={s.key}
                className={`category-pill ${selected.includes(s.key) ? 'active' : ''}`}
                onClick={() => toggle(s.key)}
              >
                {s.icon} {s.label[lang]}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" disabled={selected.length === 0} onClick={analyze}>
            🔍 {t('symptomChecker.analyze')}
          </button>
        </>
      )}

      {phase === 'thinking' && (
        <div className="tracking-card" style={{ maxWidth: 420 }}>
          <div className="support-msg bot" style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <p style={{ marginTop: 12, color: 'var(--color-ink-soft)', fontSize: 13.5 }}>{t('symptomChecker.thinking')}</p>
        </div>
      )}

      {phase === 'result' && (
        <div>
          {needsDoctor && (
            <div className="auth-error" style={{ marginBottom: 20, maxWidth: 640 }}>
              🩺 {t('symptomChecker.seeDoctor')}
            </div>
          )}

          {matchedProducts.length > 0 && (
            <>
              <h3 style={{ fontSize: 18, margin: '10px 0 16px' }}>{t('symptomChecker.resultsTitle')}</h3>
              <div className="product-grid" style={{ marginBottom: 20 }}>
                {matchedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}

          <div className="payout-breakdown" style={{ maxWidth: 640, marginBottom: 20 }}>
            {t('symptomChecker.disclaimer')}
          </div>

          <button className="btn" style={{ background: 'var(--color-line)' }} onClick={reset}>
            ↺ {t('symptomChecker.reset')}
          </button>
        </div>
      )}
    </div>
  );
}
