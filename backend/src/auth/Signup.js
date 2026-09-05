const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Логика регистрации — вынесена отдельно от controller, чтобы её можно было
// переиспользовать и в Telegram-боте (регистрация через чат).
async function signupUser({ fullName, phone, email, password, preferredLanguage }) {
  const existing = await User.findOne({ phone });
  if (existing) {
    const error = new Error('Пользователь с таким номером телефона уже зарегистрирован');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    fullName,
    phone,
    email,
    password,
    preferredLanguage: preferredLanguage || 'ru',
  });

  const token = generateToken(user._id, user.role);
  return { user, token };
}

module.exports = { signupUser };
