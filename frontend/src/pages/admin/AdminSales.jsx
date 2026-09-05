import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLanguage } from '../../context/LanguageContext.jsx';

// Мок-данные продаж для владельца аптеки: кто купил, из какой страны, сколько купил,
// какую оценку поставил заказу, куда доставили и точные GPS-координаты точки доставки.
// В боевой версии эти данные приходят из /api/admin/sales (агрегация по Order + Review).
// Числа генерируются заново при каждом заходе в раздел (случайные, но в реалистичных
// пределах) — это имитирует «живую» аналитику, обновляющуюся в реальном времени.

const BASE_BUYERS = [
  { buyer: 'Aziz Karimov', buyerCountry: 'Узбекистан', deliveryCountry: 'Узбекистан', city: 'Ташкент', gps: [41.2995, 69.2401] },
  { buyer: 'Dilnoza Yusupova', buyerCountry: 'Узбекистан', deliveryCountry: 'Узбекистан', city: 'Самарканд', gps: [39.6270, 66.9750] },
  { buyer: 'Ivan Petrov', buyerCountry: 'Россия', deliveryCountry: 'Россия', city: 'Москва', gps: [55.7558, 37.6173] },
  { buyer: 'Sherzod Nazarov', buyerCountry: 'Узбекистан', deliveryCountry: 'Узбекистан', city: 'Бухара', gps: [39.7747, 64.4286] },
  { buyer: 'Emily Carter', buyerCountry: 'США', deliveryCountry: 'США', city: 'Нью-Йорк', gps: [40.7128, -74.0060] },
  { buyer: 'Nodira Yo\u2018ldosheva', buyerCountry: 'Узбекистан', deliveryCountry: 'Узбекистан', city: 'Наманган', gps: [40.9983, 71.6726] },
  { buyer: 'Olga Smirnova', buyerCountry: 'Россия', deliveryCountry: 'Казахстан', city: 'Алматы', gps: [43.2220, 76.8512] },
  { buyer: 'Javlon Tashkentov', buyerCountry: 'Узбекистан', deliveryCountry: 'Узбекистан', city: 'Ташкент', gps: [41.3111, 69.2797] },
  { buyer: 'Marat Bekov', buyerCountry: 'Казахстан', deliveryCountry: 'Казахстан', city: 'Астана', gps: [51.1694, 71.4491] },
  { buyer: 'Sarah Johnson', buyerCountry: 'США', deliveryCountry: 'США', city: 'Чикаго', gps: [41.8781, -87.6298] },
];

const STAR_FULL = '★';
const STAR_EMPTY = '☆';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерирует «сегодняшний» набор продаж — каждый визит в раздел даёт новую случайную выборку.
function generateSales() {
  const count = randInt(6, 10);
  const shuffled = [...BASE_BUYERS].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((b, i) => ({
    id: `PE-${48200 + randInt(1, 900)}`,
    ...b,
    amountUZS: randInt(40, 3200) * 1000 + (Math.random() < 0.08 ? randInt(5, 20) * 1000000 : 0), // редко — крупная покупка
    itemsCount: randInt(1, 12),
    rating: randInt(3, 5),
  }));
}

// 7-дневная выручка для графика — тоже пересчитывается заново при каждом заходе.
function generateWeeklyRevenue() {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return days.map((day) => ({ day, revenueUZS: randInt(1200, 5400) * 1000 }));
}

export default function AdminSales() {
  const { t, formatPrice, lang } = useLanguage();
  const [sortBy, setSortBy] = useState('date');
  const [sales] = useState(() => generateSales());
  const [weekly] = useState(() => generateWeeklyRevenue());

  const sorted = useMemo(() => {
    const copy = [...sales];
    if (sortBy === 'amount') copy.sort((a, b) => b.amountUZS - a.amountUZS);
    if (sortBy === 'rating') copy.sort((a, b) => b.rating - a.rating);
    return copy;
  }, [sortBy, sales]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.amountUZS, 0);
  const avgRating = (sales.reduce((sum, s) => sum + s.rating, 0) / sales.length).toFixed(1);
  const countries = [...new Set(sales.map((s) => s.buyerCountry))];

  return (
    <div>
      <div className="section-head" style={{ margin: '0 0 20px' }}>
        <h2 style={{ fontSize: 22 }}>{t('admin.sales')}</h2>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 14px', borderRadius: 999, border: '1.5px solid var(--color-line)', background: 'var(--color-surface)', color: 'var(--color-ink)', fontWeight: 700, fontSize: 13 }}>
          <option value="date">По дате</option>
          <option value="amount">По сумме</option>
          <option value="rating">По оценке</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        <div className="tracking-card" style={{ padding: 18, marginBottom: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', fontWeight: 700 }}>Выручка (за неделю)</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>{formatPrice(totalRevenue)}</div>
        </div>
        <div className="tracking-card" style={{ padding: 18, marginBottom: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', fontWeight: 700 }}>Заказов</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>{sales.length}</div>
        </div>
        <div className="tracking-card" style={{ padding: 18, marginBottom: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', fontWeight: 700 }}>Средняя оценка</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>⭐ {avgRating}</div>
        </div>
        <div className="tracking-card" style={{ padding: 18, marginBottom: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--color-ink-soft)', fontWeight: 700 }}>Страны покупателей</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>{countries.length}</div>
        </div>
      </div>

      <div className="tracking-card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, marginBottom: 14 }}>Динамика выручки за неделю</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'var(--color-ink-soft)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--color-ink-soft)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip
              formatter={(value) => [formatPrice(value), 'Выручка']}
              contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 12, color: 'var(--color-ink)' }}
            />
            <Bar dataKey="revenueUZS" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Заказ</th>
            <th>Покупатель</th>
            <th>Страна покупателя</th>
            <th>Сумма</th>
            <th>Кол-во</th>
            <th>Оценка</th>
            <th>Доставка (город, страна)</th>
            <th>GPS</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.id}>
              <td style={{ fontWeight: 700 }}>{s.id}</td>
              <td>{s.buyer}</td>
              <td>{s.buyerCountry}</td>
              <td style={{ fontWeight: 700 }}>{formatPrice(s.amountUZS)}</td>
              <td>{s.itemsCount}</td>
              <td>
                <span style={{ color: '#E8A93C', letterSpacing: 1 }}>
                  {STAR_FULL.repeat(s.rating)}{STAR_EMPTY.repeat(5 - s.rating)}
                </span>
              </td>
              <td>{s.city}, {s.deliveryCountry}</td>
              <td>
                <a
                  href={`https://www.google.com/maps?q=${s.gps[0]},${s.gps[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: 12.5 }}
                >
                  📍 {s.gps[0].toFixed(4)}, {s.gps[1].toFixed(4)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--color-ink-soft)' }}>
        Данные обновляются при каждом заходе в раздел — в боевой версии их источник: агрегация
        реальных заказов из MongoDB (/api/admin/sales), а координаты доставки берутся из адреса
        заказа при оформлении (геокодирование), а не вводятся вручную.
      </p>
    </div>
  );
}
