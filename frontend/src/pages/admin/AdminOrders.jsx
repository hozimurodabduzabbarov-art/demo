import { useLanguage } from '../../context/LanguageContext.jsx';

const MOCK_ORDERS = [
  { id: '#10234', customer: 'Aziz Karimov', total: 3200000, status: 'delivered' },
  { id: '#10235', customer: 'Dilnoza Yusupova', total: 129000, status: 'courier_assigned' },
  { id: '#10236', customer: 'Sherzod Nazarov', total: 4200000, status: 'pending' },
];

export default function AdminOrders() {
  const { t, formatPrice } = useLanguage();
  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 20 }}>{t('admin.orders')}</h2>
      <table className="admin-table">
        <thead><tr><th>ID</th><th>Клиент</th><th>Сумма</th><th>Статус</th></tr></thead>
        <tbody>
          {MOCK_ORDERS.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{formatPrice(o.total)}</td>
              <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
