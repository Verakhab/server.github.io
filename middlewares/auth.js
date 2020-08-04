const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-err');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = async (req, res, next) => {
  const authorization = req.cookies.jwt;
  let payload;
  try {
    if (!authorization) {
      throw new Unauthorized('Требуется авторизация');
    }
    payload = await jwt.verify(authorization, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(err);
  }
  req.user = payload;
  return next();
};
