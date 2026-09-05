const Category = require('../models/categoryModel');

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, createCategory };
