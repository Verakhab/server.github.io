const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => { // eslint-disable-line
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send(err);
  }
  req.user = payload;
  next();
};
