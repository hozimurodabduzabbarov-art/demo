import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

// Плавающий виджет поддержки 24/7. Для демо — это скриптованный мок-чат
// (без реального backend), в проде сюда подключается тот же /api или сторонний
// провайдер (Intercom/Chatwoot/Telegram-оператор).

const TEXT = {
  ru: {
    title: 'Поддержка PharmaExpress',
    subtitle: 'Обычно отвечаем за 1–2 минуты',
    greeting: 'Здравствуйте! Чем можем помочь с вашим заказом?',
    placeholder: 'Напишите сообщение...',
    quick: ['Где мой заказ?', 'Как загрузить рецепт?', 'Вопрос по оплате'],
    replies: {
      'Где мой заказ?': 'Ваш заказ уже в пути 🛵 — статус и точное время можно посмотреть на странице отслеживания.',
      'Как загрузить рецепт?': 'На странице товара с пометкой «Требуется рецепт» нажмите «Загрузить рецепт» и прикрепите фото — мы проверим его перед отправкой заказа.',
      'Вопрос по оплате': 'Мы принимаем оплату картой онлайн и наличными курьеру. Средства списываются только после подтверждения заказа аптекой.',
      default: 'Спасибо за сообщение! Оператор ответит вам в ближайшее время.',
    },
  },
  uz: {
    title: 'PharmaExpress qo\u2018llab-quvvatlash',
    subtitle: 'Odatda 1–2 daqiqada javob beramiz',
    greeting: 'Assalomu alaykum! Buyurtmangiz bo\u2018yicha qanday yordam bera olamiz?',
    placeholder: 'Xabar yozing...',
    quick: ['Buyurtmam qayerda?', 'Retseptni qanday yuklash mumkin?', 'To\u2018lov bo\u2018yicha savol'],
    replies: {
      "Buyurtmam qayerda?": 'Buyurtmangiz allaqachon yo\u2018lda 🛵 — aniq vaqtni kuzatish sahifasidan ko\u2018rishingiz mumkin.',
      'Retseptni qanday yuklash mumkin?': "\u2018Retsept talab qilinadi\u2019 belgisi bo\u2018lgan mahsulot sahifasida \u2018Retsept yuklash\u2019ni bosing va rasmni biriktiring.",
      "To\u2018lov bo\u2018yicha savol": 'Kartadan onlayn yoki kuryerga naqd to\u2018lashingiz mumkin. Mablag\u2018 faqat dorixona tasdiqlagandan keyin yechiladi.',
      default: 'Xabaringiz uchun rahmat! Operator tez orada javob beradi.',
    },
  },
  en: {
    title: 'PharmaExpress Support',
    subtitle: 'We usually reply within 1–2 minutes',
    greeting: 'Hi! How can we help with your order?',
    placeholder: 'Type a message...',
    quick: ['Where is my order?', 'How do I upload a prescription?', 'Question about payment'],
    replies: {
      'Where is my order?': "Your order is on its way 🛵 — you can see the exact ETA on the tracking page.",
      'How do I upload a prescription?': "On a product page marked \u2018Prescription required\u2019, tap \u2018Upload Prescription\u2019 and attach a photo — we'll verify it before dispatching.",
      'Question about payment': "We accept online card payment and cash on delivery. Funds are only charged once the pharmacy confirms your order.",
      default: "Thanks for your message! A support agent will reply shortly.",
    },
  },
};

export default function SupportWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef(null);
  const T = TEXT[lang];

  useEffect(() => {
    setMessages([{ from: 'bot', text: T.greeting }]);
  }, [lang]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, isTyping]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);
    // Имитация "оператор печатает..." — реалистичная задержка перед ответом,
    // чтобы не выглядело как мгновенный автоответ.
    const delay = 1100 + Math.random() * 900;
    setTimeout(() => {
      const reply = T.replies[text] || T.replies.default;
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    }, delay);
  };

  return (
    <>
      {open && (
        <div className="support-panel">
          <div className="support-header">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🎧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>{T.title}</div>
              <div style={{ fontSize: 11.5, opacity: 0.85 }}>{T.subtitle}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>

          <div className="support-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`support-msg ${m.from}`}>{m.text}</div>
            ))}
            {isTyping && (
              <div className="support-msg bot" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-ink-soft)', fontWeight: 600 }}>
                  {lang === 'ru' ? 'Оператор печатает...' : lang === 'uz' ? 'Operator yozmoqda...' : 'Agent is typing...'}
                </span>
              </div>
            )}
          </div>

          <div className="support-quick-replies">
            {T.quick.map((q) => (
              <button key={q} className="support-quick-btn" disabled={isTyping} onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div className="support-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder={T.placeholder}
              disabled={isTyping}
            />
            <button className="support-send-btn" disabled={isTyping} onClick={() => send(input)}>➤</button>
          </div>
        </div>
      )}

      <button className="support-fab" onClick={() => setOpen((o) => !o)} title={T.title}>
        {open ? '✕' : '🎧'}
      </button>
    </>
  );
}
