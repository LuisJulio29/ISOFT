const usuariosRepository = require('../../repositories/usuarios');
const constants = require('../../../constants');

async function handler(req, res, next) {
  try {
    const id_usuario = req.params.id;
    const datos = req.body;

    const response = await usuariosRepository.actualizar(id_usuario, datos);

    if (response.usuario) {
      res.status(200).json({
        status: response.status,
        mensaje: 'Usuario actualizado correctamente.',
        usuario: response.usuario
      });
    } else {
      res.status(response.failure_code || 500).json({
        status: response.status,
        error: {
          code: response.failure_code || 500,
          message: response.failure_message || 'Error al actualizar el usuario.',
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
