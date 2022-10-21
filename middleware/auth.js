const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-aun-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtKey'));
    req.user = decoded;
    return next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
