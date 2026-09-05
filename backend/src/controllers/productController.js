const Product = require('../models/productModel');
const { convertPrice } = require('../utils/currency');

function withCurrency(product, currency) {
  const obj = product.toObject ? product.toObject() : product;
  return {
    ...obj,
    price: convertPrice(obj.priceUZS, currency),
    oldPrice: obj.oldPriceUZS ? convertPrice(obj.oldPriceUZS, currency) : null,
    currency,
  };
}

async function getProducts(req, res, next) {
  try {
    const { category, search, currency = 'UZS' } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = ['ru', 'uz', 'en'].map((lang) => ({
        [`name.${lang}`]: { $regex: search, $options: 'i' },
      }));
    }
    const products = await Product.find(filter).populate('category');
    res.json(products.map((p) => withCurrency(p, currency)));
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const { currency = 'UZS' } = req.query;
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    res.json(withCurrency(product, currency));
  } catch (err) {
    next(err);
  }
}

// Предзаказ дефицитного/редкого препарата, которого нет в наличии
async function preorderProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    if (!product.isRare) {
      return res.status(400).json({ message: 'Предзаказ доступен только для дефицитных препаратов' });
    }
    // В реальной системе тут создаётся заявка поставщику + запись Order(isPreorder: true)
    res.status(201).json({
      message: 'Предзаказ принят. Мы забронируем препарат у поставщика и сообщим о поступлении.',
      productId: product._id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductById, preorderProduct };
