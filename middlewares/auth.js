const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(token, JWT_SECRET || 'some-secret-key');
  } catch (err) {
    return res.status(409).send(err);
  }
  req.user = payload;
  return next();
};
