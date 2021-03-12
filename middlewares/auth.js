const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-err');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = async (req, res, next) => {
  const authorization = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) throw new Unauthorized('Требуется авторизация');
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new Unauthorized('Требуется авторизация'));
    }
    return next(err);
  }
  req.user = payload;
  return next();
};
