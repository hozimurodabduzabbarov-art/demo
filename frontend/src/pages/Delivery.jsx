import { useLanguage } from '../context/LanguageContext.jsx';

export default function Delivery() {
  const { t } = useLanguage();
  const steps = [
    { icon: '🛒', title: '1. Оформите заказ', text: 'Выберите лекарства в каталоге и добавьте их в корзину.' },
    { icon: '📄', title: '2. Загрузите рецепт', text: 'Для рецептурных препаратов приложите фото рецепта от врача.' },
    { icon: '🚴', title: '3. Курьер в пути', text: 'Заказ передаётся ближайшему курьеру в течение нескольких минут.' },
    { icon: '📦', title: '4. Доставка от 30 минут', text: 'Получите лекарства по указанному адресу — оплата картой или наличными.' },
  ];
  return (
    <div className="container">
      <div className="page-header">
        <h1>{t('nav.delivery')}</h1>
        <p>{t('hero.subtitle')}</p>
      </div>
      <div className="product-grid" style={{ marginTop: 30, marginBottom: 60 }}>
        {steps.map((s) => (
          <div className="product-card" key={s.title} style={{ width: 'auto' }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
            <div className="product-name" style={{ fontSize: 16 }}>{s.title}</div>
            <p style={{ fontSize: 13.5, color: 'var(--color-ink-soft)', marginTop: 6, lineHeight: 1.5 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
