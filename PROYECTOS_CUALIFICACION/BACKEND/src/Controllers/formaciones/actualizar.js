const formacionRepository = require('../../repositories/formaciones');
const constants = require('../../../constants');

async function handler(req, res, next) {
  try {
    const id = req.params.id;
    const datos = req.body;

    const response = await formacionRepository.actualizar(id, datos);

    if (response.formacion) {
      res.status(200).json({
        status: response.status,
        mensaje: 'Formación actualizada correctamente.',
      });
    } else {
      res.status(404).json({
        status: response.status,
        error: {
          code: response.failure_code || 404,
          message: response.failure_message || 'Formación no encontrada.',
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
