import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

// Симуляция отслеживания курьера в реальном времени, как в Яндекс Еде / Яндекс Доставке:
// статусы (принят -> собран -> в пути -> подъезжает -> доставлен), ETA пересчитывается
// с учётом смоделированной скорости, светофоров и пробок на маршруте. Курьер и транспорт
// выбираются случайно при каждом заказе — как в реальном сервисе доставки.

const STEPS = [
  { key: 'confirmed', icon: '✓' },
  { key: 'picked_up', icon: '📦' },
  { key: 'on_the_way', icon: '🛵' },
  { key: 'arriving', icon: '📍' },
  { key: 'delivered', icon: '🏠' },
];

const STEP_LABEL = {
  ru: { confirmed: 'Заказ принят', picked_up: 'Курьер забрал заказ', on_the_way: 'В пути', arriving: 'Почти на месте', delivered: 'Доставлено' },
  uz: { confirmed: 'Buyurtma qabul qilindi', picked_up: 'Kuryer buyurtmani oldi', on_the_way: 'Yo\u2018lda', arriving: 'Deyarli yetib keldi', delivered: 'Yetkazib berildi' },
  en: { confirmed: 'Order confirmed', picked_up: 'Courier picked it up', on_the_way: 'On the way', arriving: 'Almost there', delivered: 'Delivered' },
};

const TRAFFIC_LEVELS = {
  ru: { low: 'Свободно', medium: 'Умеренный трафик', high: 'Пробки' },
  uz: { low: 'Yo\u2018l ochiq', medium: "O'rtacha tirbandlik", high: 'Tirbandlik' },
  en: { low: 'Light traffic', medium: 'Moderate traffic', high: 'Heavy traffic' },
};

// Пул курьеров с разным транспортом — выбирается случайно на каждый заказ, как в реальных сервисах.
const COURIERS = [
  { name: 'Aziz Rahimov', vehicle: 'moped', plate: '01 A 482 BC', color: '#E8632C', speedFactor: 1.0 },
  { name: 'Bekzod Yusupov', vehicle: 'car', plate: '01 M 917 KA', color: '#3B6FE0', speedFactor: 1.25 },
  { name: 'Malika Tosheva', vehicle: 'bike', plate: '— вело —', color: '#4C9A5B', speedFactor: 0.72 },
  { name: 'Jasur Nomozov', vehicle: 'moped', plate: '01 B 205 EF', color: '#B8862F', speedFactor: 1.05 },
  { name: 'Sardor Aliyev', vehicle: 'car', plate: '01 K 663 QW', color: '#8A4CC4', speedFactor: 1.3 },
];

const VEHICLE_ICON = { moped: '🛵', car: '🚗', bike: '🚲' };
const VEHICLE_LABEL = {
  ru: { moped: 'Мопед', car: 'Автомобиль', bike: 'Велосипед' },
  uz: { moped: 'Moped', car: 'Avtomobil', bike: 'Velosiped' },
  en: { moped: 'Scooter', car: 'Car', bike: 'Bicycle' },
};

// Названия улиц для живых статусных сообщений от курьера (район Юнусабад/Мирзо-Улугбек — Ташкент)
const STREETS = ['Amir Temur', 'Mirzo Ulug\u2018bek', 'Bunyodkor', 'Nukus', 'Shahrisabz', 'Yunusobod-12'];

const LIVE_MESSAGES = {
  ru: (street) => ({
    picked_up: 'Забрал ваш заказ, выезжаю к вам 🏍',
    early: `Еду по ул. ${street}, всё по плану`,
    traffic: `Стою на светофоре на ${street}, минутка задержки`,
    late: 'Объезжаю затор по параллельной улице',
    arriving: 'Уже на вашей улице, почти на месте!',
  }),
  uz: (street) => ({
    picked_up: 'Buyurtmangizni oldim, sizga yo\u2018l oldim 🏍',
    early: `${street} ko\u2018chasi bo\u2018ylab kelyapman, hammasi rejadagidek`,
    traffic: `${street}da svetoforda turibman, biroz kechikish bo\u2018ladi`,
    late: 'Tirbandlikni yon ko\u2018chadan aylanib o\u2018tyapman',
    arriving: 'Allaqachon sizning ko\u2018changizdaman, deyarli yetib keldim!',
  }),
  en: (street) => ({
    picked_up: 'Picked up your order, heading your way 🏍',
    early: `Riding along ${street}, right on schedule`,
    traffic: `Stopped at a red light on ${street}, small delay`,
    late: 'Taking a detour around traffic',
    arriving: 'Already on your street, almost there!',
  }),
};

const ROUTE_PATH = 'M 20 130 C 90 40, 160 160, 230 70 S 360 30, 430 90';

// Базовая длительность полного маршрута (от 0% до 100%) в секундах — от неё считается ETA,
// поэтому таймер и прогресс-бар всегда достигают нуля/100% одновременно (без рассинхрона).
const BASE_ROUTE_SECONDS = 900; // 15 минут на полный маршрут при обычной скорости

function useCourierSimulation(speedFactor) {
  const [stepIndex, setStepIndex] = useState(1);
  const [traffic, setTraffic] = useState('medium');
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((prev) => {
        const drift = (traffic === 'high' ? 0.5 : traffic === 'medium' ? 1 : 1.6) * speedFactor;
        const next = Math.min(100, prev + drift);
        if (next > 30 && stepIndex < 2) setStepIndex(2);
        if (next > 78 && stepIndex < 3) setStepIndex(3);
        if (next >= 100 && stepIndex < 4) setStepIndex(4);
        return next;
      });

      setTraffic(() => {
        const roll = Math.random();
        if (roll < 0.12) return 'high';
        if (roll < 0.35) return 'medium';
        return 'low';
      });
    }, 1500);

    return () => clearInterval(tick);
  }, [traffic, stepIndex, speedFactor]);

  // ETA — производная величина от оставшегося прогресса, а не отдельный таймер,
  // поэтому она физически не может дойти до 0 раньше/позже, чем прогресс дойдёт до 100%.
  const etaSeconds = Math.round((BASE_ROUTE_SECONDS / speedFactor) * (1 - progress / 100));

  return { stepIndex, etaSeconds, traffic, progress };
}

export default function CourierTracking() {
  const { lang, t } = useLanguage();
  const [courier] = useState(() => COURIERS[Math.floor(Math.random() * COURIERS.length)]);
  const [street] = useState(() => STREETS[Math.floor(Math.random() * STREETS.length)]);
  const { stepIndex, etaSeconds, traffic, progress } = useCourierSimulation(courier.speedFactor);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [rating, setRating] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const lastAutoMsgRef = useRef(null);
  const chatBodyRef = useRef(null);

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;
  const delivered = stepIndex >= 4;
  const statusText = STEP_LABEL[lang][STEPS[stepIndex].key];
  const trafficText = TRAFFIC_LEVELS[lang][traffic];
  const vehicleIcon = VEHICLE_ICON[courier.vehicle];
  const messages = LIVE_MESSAGES[lang](street);

  // Курьер сам "пишет" статусные сообщения по мере продвижения заказа (без действий пользователя).
  useEffect(() => {
    let key = null;
    if (stepIndex === 1 && progress < 25) key = 'picked_up';
    else if (traffic === 'high' && progress < 78) key = 'traffic';
    else if (traffic === 'medium' && progress > 40 && progress < 70) key = 'late';
    else if (progress > 82 && progress < 100) key = 'arriving';
    else if (progress < 60) key = 'early';

    if (key && lastAutoMsgRef.current !== key) {
      lastAutoMsgRef.current = key;
      setChatMessages((prev) => [...prev, { from: 'courier', text: messages[key] }]);
    }
  }, [progress, traffic, stepIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, isTyping, chatOpen]);

  const askWhereAreYou = () => {
    const question = lang === 'ru' ? 'Вы где сейчас?' : lang === 'uz' ? 'Hozir qayerdasiz?' : 'Where are you right now?';
    setChatMessages((prev) => [...prev, { from: 'user', text: question }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = delivered
        ? (lang === 'ru' ? 'Уже доставил ваш заказ! Спасибо 🙌' : lang === 'uz' ? 'Buyurtmangizni yetkazib berdim! Rahmat 🙌' : 'Already delivered your order! Thanks 🙌')
        : (lang === 'ru' ? `Я на ул. ${street}, буду у вас через ${minutes} мин ${seconds} сек` : lang === 'uz' ? `${street} ko\u2018chasidaman, ${minutes} daq ${seconds} soniyada yetib boraman` : `I'm on ${street}, will reach you in ${minutes}m ${seconds}s`);
      setChatMessages((prev) => [...prev, { from: 'courier', text: reply }]);
    }, 1300);
  };

  const shareTracking = () => {
    const url = `${window.location.origin}/tracking/PE-48213`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="container tracking-page">
      <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 6 }}>{lang === 'ru' ? 'Отслеживание заказа' : lang === 'uz' ? 'Buyurtmani kuzatish' : 'Track your order'}</h1>
      <p style={{ color: 'var(--color-ink-soft)', fontSize: 14, marginBottom: 26 }}>
        {lang === 'ru' ? 'Заказ №PE-48213' : lang === 'uz' ? 'Buyurtma №PE-48213' : 'Order #PE-48213'}
      </p>

      <div className="tracking-card">
        <div className="tracking-eta">
          {delivered ? (
            <span className="eta-number" style={{ color: 'var(--color-success)' }}>✓</span>
          ) : (
            <span className="eta-number">{minutes}:{String(seconds).padStart(2, '0')}</span>
          )}
          <span className="eta-label">
            {delivered
              ? (lang === 'ru' ? 'Заказ доставлен' : lang === 'uz' ? 'Buyurtma yetkazildi' : 'Order delivered')
              : (lang === 'ru' ? 'мин. до доставки' : lang === 'uz' ? "daqiqada yetib boradi" : 'min to delivery')}
          </span>
        </div>

        <div className="tracking-status-row">
          <span>{statusText}</span>
          {!delivered && <span className={`traffic-pill ${traffic}`}>🚦 {trafficText}</span>}
          <button onClick={shareTracking} className="support-quick-btn" style={{ marginLeft: 'auto' }}>
            {shareCopied ? '✓ ' + (lang === 'ru' ? 'Скопировано' : lang === 'uz' ? 'Nusxalandi' : 'Copied') : '🔗 ' + (lang === 'ru' ? 'Поделиться' : lang === 'uz' ? 'Ulashish' : 'Share')}
          </button>
        </div>

        <div className="route-map">
          <svg viewBox="0 0 460 170" preserveAspectRatio="none">
            <path d={ROUTE_PATH} fill="none" stroke="var(--color-line)" strokeWidth="6" strokeLinecap="round" />
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke={courier.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={600 - (600 * progress) / 100}
              style={{ transition: 'stroke-dashoffset 1.4s linear' }}
            />
            <circle cx="20" cy="130" r="8" fill="var(--color-ink)" />
            <text x="34" y="134" fontSize="11" fontFamily="Manrope, sans-serif" fill="var(--color-ink-soft)">🏪</text>
            <circle cx="430" cy="90" r="8" fill="var(--color-success)" />
            <text x="404" y="76" fontSize="11" fontFamily="Manrope, sans-serif" fill="var(--color-ink-soft)">🏠</text>
            <g style={{ offsetPath: `path("${ROUTE_PATH}")`, offsetDistance: `${progress}%`, transition: 'offset-distance 1.4s linear' }} className="route-courier-dot">
              <circle r="11" fill={courier.color} stroke="white" strokeWidth="3" />
              <text x="-6" y="4" fontSize="12">{vehicleIcon}</text>
            </g>
          </svg>
        </div>

        <div className="status-stepper">
          {STEPS.map((s, i) => (
            <div className="step" key={s.key}>
              <div className={`step-dot ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}>
                {i < stepIndex ? '✓' : s.icon}
              </div>
              <div className={`step-label ${i <= stepIndex ? 'active' : ''}`}>{STEP_LABEL[lang][s.key]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tracking-card">
        <div className="courier-card">
          <div className="courier-avatar" style={{ background: courier.color }}>{courier.name[0]}</div>
          <div>
            <div style={{ fontWeight: 800 }}>
              {courier.name} — {lang === 'ru' ? 'ваш курьер' : lang === 'uz' ? 'sizning kuryeringiz' : 'your courier'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--color-ink-soft)' }}>
              {vehicleIcon} {VEHICLE_LABEL[lang][courier.vehicle]} · {courier.plate}
            </div>
          </div>
          <div className="courier-actions">
            <a className="icon-round-btn" href="tel:+998900000000" title="Call">📞</a>
            <button className="icon-round-btn" title="Chat" onClick={() => setChatOpen((o) => !o)}>💬</button>
          </div>
        </div>

        {chatOpen && (
          <div style={{ marginTop: 16, border: '1px solid var(--color-line)', borderRadius: 16, overflow: 'hidden' }}>
            <div className="support-body" ref={chatBodyRef} style={{ maxHeight: 220, minHeight: 100 }}>
              {chatMessages.length === 0 && (
                <p style={{ color: 'var(--color-ink-soft)', fontSize: 13, textAlign: 'center' }}>
                  {lang === 'ru' ? 'Курьер напишет вам, как только будут новости о заказе' : lang === 'uz' ? "Kuryer yangilik bo\u2018lishi bilan yozadi" : "Your courier will message you with updates"}
                </p>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`support-msg ${m.from === 'courier' ? 'bot' : 'user'}`}>{m.text}</div>
              ))}
              {isTyping && (
                <div className="support-msg bot" style={{ display: 'flex', gap: 4 }}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              )}
            </div>
            <div className="support-quick-replies" style={{ padding: '0 12px 12px' }}>
              <button className="support-quick-btn" disabled={isTyping} onClick={askWhereAreYou}>
                📍 {lang === 'ru' ? 'Вы где сейчас?' : lang === 'uz' ? 'Hozir qayerdasiz?' : 'Where are you?'}
              </button>
            </div>
          </div>
        )}
      </div>

      {delivered && (
        <div className="tracking-card">
          <p style={{ fontWeight: 800, marginBottom: 10 }}>
            {lang === 'ru' ? `Как вам курьер ${courier.name}?` : lang === 'uz' ? `${courier.name} kuryer sifatida qanday?` : `How was courier ${courier.name}?`}
          </p>
          <div style={{ display: 'flex', gap: 6, fontSize: 26, cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} onClick={() => setRating(n)} style={{ color: n <= rating ? '#E8A93C' : 'var(--color-line)' }}>★</span>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ marginTop: 10, color: 'var(--color-success)', fontWeight: 700, fontSize: 13.5 }}>
              {lang === 'ru' ? 'Спасибо за оценку!' : lang === 'uz' ? 'Bahoingiz uchun rahmat!' : 'Thanks for the rating!'}
            </p>
          )}
        </div>
      )}

      <Link to="/catalog" className="btn btn-primary">{lang === 'ru' ? '← В каталог' : lang === 'uz' ? '← Katalogga' : '← Back to catalog'}</Link>
    </div>
  );
}
