const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-err');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = async (req, res, next) => {
  const authoriz = req.headers.authorization;
  // console.log(authoriz);
  // console.log(req.headers);
  // console.log(req.headers.authorization);
  if (!authoriz || !authoriz.startsWith('Bearer ')) throw new Unauthorized('Требуется авторизация');
  const token = authoriz.replace('Bearer ', '');
  // console.log(token);
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
  // console.log(req.user);
  return next();
};
