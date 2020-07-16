const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }
  req.user = payload;
  next();
};
