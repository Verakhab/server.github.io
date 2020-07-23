const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }
  let payload;
  try {
    payload = await jwt.verify(authorization, JWT_SECRET || 'some-secret-key');
  } catch (err) {
    return res.status(401).send(err);
  }
  req.user = payload;
  return next();
};
