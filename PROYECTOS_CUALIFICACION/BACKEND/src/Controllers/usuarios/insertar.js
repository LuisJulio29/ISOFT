const usuariosRepository = require('../../repositories/usuarios');
const constants = require('../../../constants');

async function handler(req, res, next) {
  try {
    const usuario = req.body;

    // Validar ingreso
    const response = await usuariosRepository.insertar(usuario);
    
    if (response.usuario) {
      res.status(200).json({
        status: response.status,
       mensaje: 'Usuario creado correctamente.',
      });
    } else {
      res.status(401).json({
        status: response.status,
        error: {
          code: response.failure_code || 401,
          message: response.failure_message || 'Usuario o contraseña incorrectos.',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: constants.INTERNAL_ERROR_MESSAGE,
      error: {
        code: error.code || 500,
        message: error.message || 'Error interno del servidor.',
      },
    });
  }
}

module.exports = [handler];
