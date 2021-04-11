/* eslint-disable import/no-unresolved */
const jwt = require('jsonwebtoken');

const {NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startswith('Bearer ')) {
    return res.status(401).send({
      message: 'Authorization required. No auth!'
    });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch(err) {
    return res.status(401).send({
      message: 'Authorization required failed'
    });
  }

  req.user = payload;
  return next();
};
