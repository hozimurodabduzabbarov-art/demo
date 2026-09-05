const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Проверяет JWT из заголовка Authorization: Bearer <token>
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Нет доступа: токен не найден' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Пользователь не найден' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Токен недействителен или истёк' });
  }
}

module.exports = { protect };
