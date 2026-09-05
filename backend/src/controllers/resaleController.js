const ResaleListing = require('../models/resaleListingModel');
const User = require('../models/userModel');

const DEFAULT_COMMISSION = Number(process.env.DEFAULT_RESALE_COMMISSION_PERCENT) || 15;

// Пользователь выставляет купленный (но неиспользованный) препарат на перепродажу.
// Наценка ограничена maxMarkupPercent, чтобы не допустить спекуляцию дефицитом.
async function createListing(req, res, next) {
  try {
    const { productId, originalOrderId, purchasePriceUZS, resalePriceUZS, maxMarkupPercent = 30, expiryDate } = req.body;

    const ceiling = purchasePriceUZS * (1 + maxMarkupPercent / 100);
    if (resalePriceUZS > ceiling) {
      return res.status(400).json({
        message: `Цена перепродажи не может превышать ${Math.round(ceiling)} (наценка не более ${maxMarkupPercent}%)`,
      });
    }

    const listing = await ResaleListing.create({
      seller: req.user._id,
      product: productId,
      originalOrder: originalOrderId,
      purchasePriceUZS,
      resalePriceUZS,
      maxMarkupPercent,
      commissionPercent: DEFAULT_COMMISSION,
      expiryDate,
      status: 'pending_review', // проходит модерацию администратора перед публикацией
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

// Публичная витрина маркетплейса — только одобренные лоты
async function getListings(req, res, next) {
  try {
    const listings = await ResaleListing.find({ status: 'listed' })
      .populate('product')
      .populate('seller', 'fullName');
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

// Покупка лота: аптека удерживает комиссию commissionPercent, остаток идёт продавцу
async function buyListing(req, res, next) {
  try {
    const listing = await ResaleListing.findById(req.params.id);
    if (!listing || listing.status !== 'listed') {
      return res.status(400).json({ message: 'Лот недоступен для покупки' });
    }

    const commission = Math.round(listing.resalePriceUZS * (listing.commissionPercent / 100));
    const sellerPayout = listing.resalePriceUZS - commission;

    listing.status = 'sold';
    listing.buyer = req.user._id;
    await listing.save();

    await User.findByIdAndUpdate(listing.seller, { $inc: { balance: sellerPayout } });

    res.json({
      message: 'Покупка успешна',
      paidTotal: listing.resalePriceUZS,
      pharmacyCommission: commission,
      sellerPayout,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createListing, getListings, buyListing };
