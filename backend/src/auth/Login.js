const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

async function loginUser({ phone, password }) {
  const user = await User.findOne({ phone });
  if (!user) {
    const error = new Error('Неверный номер телефона или пароль');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Неверный номер телефона или пароль');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role);
  return { user, token };
}

module.exports = { loginUser };
