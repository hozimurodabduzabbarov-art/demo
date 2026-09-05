require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

const categories = [
  { name: { ru: 'Обезболивающие', uz: "Og'riq qoldiruvchi", en: 'Pain relief' }, slug: 'pain-relief', icon: '💊' },
  { name: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, slug: 'antibiotics', icon: '🧪' },
  { name: { ru: 'Аллергия', uz: 'Allergiya', en: 'Allergy' }, slug: 'allergy', icon: '🌿' },
  { name: { ru: 'ЖКТ', uz: 'Oshqozon-ichak', en: 'Digestive' }, slug: 'digestive', icon: '🍃' },
  { name: { ru: 'Витамины', uz: 'Vitaminlar', en: 'Vitamins' }, slug: 'vitamins', icon: '🍊' },
  { name: { ru: 'Простуда и грипп', uz: 'Shamollash va gripp', en: 'Cold & flu' }, slug: 'cold-flu', icon: '🤧' },
  { name: { ru: 'Редкие препараты', uz: 'Kamyob dorilar', en: 'Rare medicines' }, slug: 'rare', icon: '⭐' },
];

// Цены в сумах (базовая валюта). Пересчитаны на основе реальных розничных цен
// в аптеках РФ/РУз и официального курса ЦБ Узбекистана, проверено 25.08.2026.
const products = [
  { slug: 'ibuprofen-200', name: { ru: 'Ибупрофен', uz: 'Ibuprofen', en: 'Ibuprofen' }, description: { ru: 'НПВС для снятия боли и жара.', uz: "Og'riq va isitmani tushirish uchun NYVS.", en: 'NSAID for pain and fever relief.' }, categorySlug: 'pain-relief', dosage: '200 мг', unitCount: 10, priceUZS: 9200, oldPriceUZS: 11000, stock: 120, images: [] },
  { slug: 'amoxicillin-500', name: { ru: 'Амоксициллин', uz: 'Amoksitsillin', en: 'Amoxicillin' }, description: { ru: 'Антибиотик широкого спектра. По рецепту.', uz: 'Keng ta\u2019sirli antibiotik. Retsept asosida.', en: 'Broad-spectrum antibiotic. Prescription required.' }, categorySlug: 'antibiotics', dosage: '500 мг', unitCount: 16, priceUZS: 29700, oldPriceUZS: 38000, stock: 60, prescriptionRequired: true, images: [] },
  { slug: 'paracetamol-500', name: { ru: 'Парацетамол', uz: 'Paratsetamol', en: 'Paracetamol' }, description: { ru: 'От боли и жара.', uz: "Og'riq va isitmaga qarshi.", en: 'For pain and fever relief.' }, categorySlug: 'pain-relief', dosage: '500 мг', unitCount: 20, priceUZS: 5950, oldPriceUZS: 6850, stock: 200, images: [], variants: [ { color: 'orange', packageImage: 'paracetamol-orange.png', accentBackground: '#E8632C', stock: 150 }, { color: 'blue', packageImage: 'paracetamol-blue.png', accentBackground: '#2C6BE8', stock: 50 } ] },
  { slug: 'cetirizine-10', name: { ru: 'Цетиризин', uz: 'Setirizin', en: 'Cetirizine' }, description: { ru: 'Антигистамин от аллергии, не вызывает сонливости.', uz: 'Allergiyaga qarshi, uyquchanlik keltirmaydi.', en: 'Non-drowsy antihistamine for allergy relief.' }, categorySlug: 'allergy', dosage: '10 мг', unitCount: 10, priceUZS: 25500, oldPriceUZS: 32000, stock: 90, images: [] },
  { slug: 'omeprazole-20', name: { ru: 'Омепразол', uz: 'Omezol', en: 'Omeprazole' }, description: { ru: 'Снижает кислотность желудка.', uz: 'Oshqozon kislotaligini pasaytiradi.', en: 'Reduces stomach acidity.' }, categorySlug: 'digestive', dosage: '20 мг', unitCount: 14, priceUZS: 35400, oldPriceUZS: 44000, stock: 75, images: [] },
  { slug: 'aspirin-cardio-100', name: { ru: 'Аспирин Кардио', uz: 'Aspirin Kardio', en: 'Aspirin Cardio' }, description: { ru: 'Профилактика тромбозов, кишечнорастворимая оболочка.', uz: 'Tromboz profilaktikasi.', en: 'Cardiovascular prevention, enteric-coated.' }, categorySlug: 'pain-relief', dosage: '100 мг', unitCount: 28, priceUZS: 15900, oldPriceUZS: 18400, stock: 140, images: [] },
  { slug: 'loratadine-10', name: { ru: 'Лоратадин', uz: 'Loratadin', en: 'Loratadine' }, description: { ru: 'Антигистаминный препарат от аллергии.', uz: 'Allergiyaga qarshi antigistamin dori.', en: 'Antihistamine for allergy relief.' }, categorySlug: 'allergy', dosage: '10 мг', unitCount: 10, priceUZS: 12800, oldPriceUZS: 15600, stock: 100, images: [] },
  { slug: 'drotaverine-40', name: { ru: 'Но-шпа (Дротаверин)', uz: 'No-shpa (Drotaverin)', en: 'No-shpa (Drotaverine)' }, description: { ru: 'Спазмолитик, снимает спазмы и боль.', uz: 'Spazmolitik, spazm va og\u2018riqni yo\u2018qotadi.', en: 'Antispasmodic, relieves cramps and pain.' }, categorySlug: 'pain-relief', dosage: '40 мг', unitCount: 24, priceUZS: 25500, oldPriceUZS: 29700, stock: 110, images: [] },
  { slug: 'activated-charcoal-250', name: { ru: 'Активированный уголь', uz: 'Faollashtirilgan ko\u2018mir', en: 'Activated Charcoal' }, description: { ru: 'Сорбент при отравлениях и вздутии.', uz: 'Zaharlanish va dam bo\u2018lishda sorbent.', en: 'Sorbent for poisoning and bloating.' }, categorySlug: 'digestive', dosage: '250 мг', unitCount: 10, priceUZS: 4950, oldPriceUZS: 6400, stock: 220, images: [] },
  { slug: 'vitamin-c-500', name: { ru: 'Витамин С', uz: 'Vitamin C', en: 'Vitamin C' }, description: { ru: 'Аскорбиновая кислота для иммунитета.', uz: 'Immunitet uchun askorbin kislotasi.', en: 'Ascorbic acid for immunity support.' }, categorySlug: 'vitamins', dosage: '500 мг', unitCount: 20, priceUZS: 7800, oldPriceUZS: 9900, stock: 180, images: [] },
  { slug: 'vitamin-d3-2000', name: { ru: 'Витамин D3', uz: 'Vitamin D3', en: 'Vitamin D3' }, description: { ru: 'Поддержка костей и иммунитета.', uz: 'Suyak va immunitetni qo\u2018llab-quvvatlaydi.', en: 'Supports bones and immunity.' }, categorySlug: 'vitamins', dosage: '2000 МЕ', unitCount: 30, priceUZS: 49500, oldPriceUZS: 59500, stock: 85, images: [] },
  { slug: 'ambroxol-syrup', name: { ru: 'Амброксол сироп', uz: 'Ambroksol sirop', en: 'Ambroxol Syrup' }, description: { ru: 'Отхаркивающее средство от кашля.', uz: "Yo'talga qarshi balg'am ko'chiruvchi vosita.", en: 'Expectorant for cough relief.' }, categorySlug: 'cold-flu', dosage: '100 мл', unitCount: 1, priceUZS: 19800, oldPriceUZS: 24100, stock: 65, images: [] },
  { slug: 'xylometazoline-spray', name: { ru: 'Спрей от насморка', uz: 'Burun spreyi', en: 'Nasal Spray' }, description: { ru: 'Ксилометазолин, сужает сосуды слизистой носа.', uz: 'Ksilometazolin, burun shilliq qavatini toraytiradi.', en: 'Xylometazoline, relieves nasal congestion.' }, categorySlug: 'cold-flu', dosage: '0.1%', unitCount: 1, priceUZS: 13500, oldPriceUZS: 17000, stock: 130, images: [] },
  { slug: 'loperamide-2', name: { ru: 'Лоперамид', uz: 'Loperamid', en: 'Loperamide' }, description: { ru: 'При острой диарее.', uz: "O'tkir ich ketishida.", en: 'For acute diarrhea.' }, categorySlug: 'digestive', dosage: '2 мг', unitCount: 10, priceUZS: 10600, oldPriceUZS: 13500, stock: 95, images: [] },
  { slug: 'azithromycin-500', name: { ru: 'Азитромицин', uz: 'Azitromitsin', en: 'Azithromycin' }, description: { ru: 'Антибиотик широкого спектра, курс 3 дня. По рецепту.', uz: '3 kunlik kurs, keng ta\u2019sirli antibiotik. Retsept asosida.', en: '3-day course broad-spectrum antibiotic. Prescription required.' }, categorySlug: 'antibiotics', dosage: '500 мг', unitCount: 3, priceUZS: 39700, oldPriceUZS: 48200, stock: 40, prescriptionRequired: true, images: [] },
  { slug: 'rare-oncology-drug', name: { ru: 'Иматиниб 400 мг (дефицит)', uz: 'Imatinib 400 mg (tanqis)', en: 'Imatinib 400 mg (rare)' }, description: { ru: 'Редкий онкологический препарат. Только по предзаказу.', uz: 'Kamyob onkologik dori. Faqat oldindan buyurtma.', en: 'Rare oncology medicine. Pre-order only.' }, categorySlug: 'rare', dosage: '400 мг', unitCount: 30, priceUZS: 23400000, stock: 0, isRare: true, prescriptionRequired: true, images: [] },
];

async function run() {
  await connectDB();
  await Category.deleteMany();
  await Product.deleteMany();

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

  const productsWithCategory = products.map(({ categorySlug, ...p }) => ({
    ...p,
    category: categoryMap[categorySlug],
  }));

  await Product.insertMany(productsWithCategory);
  console.log(`[Seed] Загружено категорий: ${createdCategories.length}, товаров: ${productsWithCategory.length}`);
  mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
