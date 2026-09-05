# PharmaExpress — Backend (Node.js / Express / MongoDB)

Онлайн-аптека с доставкой, предзаказом дефицитных лекарств и маркетплейсом перепродажи.

## Запуск

```
cd backend
cp .env.example .env
npm install
npm run seed     # заполнить базу тестовыми товарами
npm run dev       # старт на http://localhost:5000
```

## Структура

```
src/
  api/           точка входа роутера (index.js собирает все routes)
  auth/          логика логина и регистрации (используется authController)
  config/        подключение к БД
  controllers/   бизнес-логика каждого модуля
  middlewares/   auth (JWT), admin, обработка ошибок
  models/        Mongoose-схемы (User, Product, Category, Order, ResaleListing)
  routes/        express.Router() для каждого модуля
  seed/          тестовые данные (те же товары, что во фронтенде)
  utils/         генерация токена, расчёт цены с учётом валюты
```

## Основные эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| POST | /api/auth/signup | Регистрация |
| POST | /api/auth/login | Вход, возвращает JWT |
| GET  | /api/products | Каталог (фильтр по категории/поиску) |
| GET  | /api/products/:id | Карточка товара (варианты упаковки/цвета) |
| POST | /api/products/:id/preorder | Предзаказ дефицитного товара |
| GET  | /api/categories | Список категорий |
| POST | /api/orders | Оформление заказа |
| GET  | /api/orders/my | Мои заказы |
| POST | /api/resale | Выставить купленный препарат на перепродажу |
| GET  | /api/resale | Витрина перепродажи (маркетплейс) |
| POST | /api/resale/:id/buy | Купить лот перепродажи (аптека берёт комиссию) |
| /api/admin/* | CRUD товаров/категорий, все заказы, модерация resale (только admin) |

## Модель перепродажи (resale)

Пользователь, купивший редкий/дорогой препарат (но не вскрывший упаковку,
срок годности не истёк), может выставить его на витрину `resale` со своей
ценой — не выше `maxMarkupPercent` от цены покупки (по умолчанию +30%).
При покупке лота система удерживает комиссию аптеки `commissionPercent`
(10–20%, настраивается в `.env` / через админку), остальное зачисляется
продавцу на баланс аккаунта (`user.balance`).
