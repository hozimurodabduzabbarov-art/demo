function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Доступ только для администратора' });
}

module.exports = { adminOnly };
