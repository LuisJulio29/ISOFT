const usuarioDocenteRepo = require('../../Repositories/usuario_docente');
const constants = require('../../../constants');

async function handler(req, res, next) {
  try {
    const response = await usuarioDocenteRepo.listarConDetalle();

    if (response.usuarios_docentes) {
      res.status(200).json({
        status: response.status,
        usuarios_docentes: response.usuarios_docentes
      });
    } else {
      res.status(response.failure_code || 500).json({
        status: response.status,
        error: {
          code: response.failure_code || 500,
          message: response.failure_message || 'Error al obtener usuarios_docentes.',
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
