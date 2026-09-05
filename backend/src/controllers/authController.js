const { signupUser } = require('../auth/Signup');
const { loginUser } = require('../auth/Login');

async function signup(req, res, next) {
  try {
    const { user, token } = await signupUser(req.body);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        balance: user.balance,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 400);
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        balance: user.balance,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 401);
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { signup, login, me };
