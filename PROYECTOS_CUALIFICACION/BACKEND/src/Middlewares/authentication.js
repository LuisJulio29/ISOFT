const jwt = require('jsonwebtoken');
const constants = require('../../constants');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, constants.TOKEN_SECRET);
    req.user = decoded; // Adjunta datos del usuario al request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = verifyToken;
