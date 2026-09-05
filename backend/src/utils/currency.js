// Конвертер валют. Курсы на основе официального курса ЦБ Узбекистана
// на 25.08.2026 (cbu.uz, tradingeconomics.com): 1 USD = 11 818.07 UZS, 1 RUB = 141.69 UZS.
// В боевой версии подтягивать курс по расписанию (cron) через API ЦБ РУз / ЦБ РФ.
const RATES = {
  UZS: 1,
  RUB: 1 / 141.69,
  USD: 1 / 11818.07,
};

function convertPrice(priceInUZS, targetCurrency = 'UZS') {
  const rate = RATES[targetCurrency] ?? 1;
  const value = priceInUZS * rate;
  return targetCurrency === 'UZS' ? Math.round(value) : Math.round(value * 100) / 100;
}

module.exports = { convertPrice, RATES };
