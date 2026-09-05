require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API = process.env.API_BASE_URL || 'http://localhost:5000/api';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://example.com';

if (!TOKEN) {
  console.error('Укажите TELEGRAM_BOT_TOKEN в .env — токен выдаёт @BotFather');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Сессии в памяти: язык, авторизация, корзина. В проде лучше вынести в Redis/БД.
const sessions = new Map();
function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, { lang: 'ru', token: null, cart: [] });
  }
  return sessions.get(chatId);
}

const CURRENCY_BY_LANG = { ru: 'RUB', uz: 'UZS', en: 'USD' };

const TEXT = {
  ru: {
    welcome: '👋 Добро пожаловать в PharmaExpress! Нужные лекарства — быстрая доставка.',
    chooseLang: 'Выберите язык / Tilni tanlang / Choose language',
    menu: '💊 Каталог\n🛒 Корзина\n⭐ Предзаказ\n🔁 Перепродажа\n📄 Загрузить рецепт',
    openApp: 'Открыть приложение',
    catalogEmpty: 'Каталог пуст либо backend недоступен.',
  },
  uz: {
    welcome: "👋 PharmaExpress'ga xush kelibsiz! Kerakli dorilar — tez yetkazib beriladi.",
    chooseLang: 'Tilni tanlang',
    menu: "💊 Katalog\n🛒 Savat\n⭐ Oldindan buyurtma\n🔁 Qayta sotish\n📄 Retsept yuklash",
    openApp: 'Ilovani ochish',
    catalogEmpty: 'Katalog bo\u2018sh yoki backend mavjud emas.',
  },
  en: {
    welcome: '👋 Welcome to PharmaExpress! Essential medicines — delivered fast.',
    chooseLang: 'Choose language',
    menu: '💊 Catalog\n🛒 Cart\n⭐ Pre-order\n🔁 Resale\n📄 Upload prescription',
    openApp: 'Open the app',
    catalogEmpty: 'Catalog is empty or backend is unreachable.',
  },
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const session = getSession(chatId);
  bot.sendMessage(chatId, TEXT[session.lang].chooseLang, {
    reply_markup: {
      inline_keyboard: [[
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
        { text: "🇺🇿 O'zbekcha", callback_data: 'lang_uz' },
        { text: '🇬🇧 English', callback_data: 'lang_en' },
      ]],
    },
  });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const session = getSession(chatId);

  if (query.data.startsWith('lang_')) {
    session.lang = query.data.replace('lang_', '');
    sendMainMenu(chatId, session);
  }

  if (query.data === 'show_catalog') {
    await showCatalog(chatId, session);
  }

  bot.answerCallbackQuery(query.id);
});

function sendMainMenu(chatId, session) {
  const t = TEXT[session.lang];
  bot.sendMessage(chatId, `${t.welcome}\n\n${t.menu}`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💊 ' + t.menu.split('\n')[0].slice(2), callback_data: 'show_catalog' }],
        [{ text: '🌐 ' + t.openApp, web_app: { url: WEBAPP_URL } }],
      ],
    },
  });
}

// Каталог берётся из того же backend API, что и веб-приложение — данные всегда совпадают.
async function showCatalog(chatId, session) {
  const t = TEXT[session.lang];
  try {
    const currency = CURRENCY_BY_LANG[session.lang];
    const { data: products } = await axios.get(`${API}/products`, { params: { currency } });
    if (!products.length) return bot.sendMessage(chatId, t.catalogEmpty);

    for (const p of products.slice(0, 10)) {
      const name = p.name?.[session.lang] || p.name?.ru;
      bot.sendMessage(
        chatId,
        `💊 *${name}* ${p.dosage || ''}\n${p.price} ${currency}\n${p.description?.[session.lang] || ''}`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: '🛒 ' + t.openApp, web_app: { url: `${WEBAPP_URL}/product/${p._id}` } }]],
          },
        }
      );
    }
  } catch (err) {
    bot.sendMessage(chatId, t.catalogEmpty + `\n(${err.message})`);
  }
}

console.log('🤖 PharmaExpress Telegram bot запущен (polling)...');
