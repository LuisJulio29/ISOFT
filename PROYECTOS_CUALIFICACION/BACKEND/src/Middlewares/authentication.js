const constants = require('../../constants');
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado', status: 401 });
    }
    
    jwt.verify(token, constants.TOKEN_SECRET, (err, user) => {
        if (err) {
            // Si el token ha expirado o es inválido, devuelve un mensaje apropiado
            return res.status(403).json({ mensaje: 'Token no válido o expirado', status: 403 });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateJWT };
