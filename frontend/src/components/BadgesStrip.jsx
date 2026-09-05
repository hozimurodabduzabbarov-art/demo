import { useLanguage } from '../context/LanguageContext.jsx';

export default function BadgesStrip() {
  const { t } = useLanguage();
  const items = [
    { icon: '🚚', key: 'delivery' },
    { icon: '✅', key: 'verified' },
    { icon: '🛡️', key: 'quality' },
    { icon: '🎧', key: 'support' },
  ];
  return (
    <div className="container">
      <div className="badges-strip">
        {items.map((i) => (
          <div className="badge-item" key={i.key}>
            <span className="badge-icon">{i.icon}</span>
            <span>{t(`badges.${i.key}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
