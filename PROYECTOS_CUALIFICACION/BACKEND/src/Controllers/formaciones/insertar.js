const formacionRepository = require('../../repositories/formaciones');
const constants = require('../../../constants');

async function handler(req, res, next) {
  try {
    const formacion = req.body;

    const response = await formacionRepository.insertar(formacion);

    if (response.formacion) {
      res.status(200).json({
        status: response.status,
        mensaje: 'Formación creada correctamente.',
      });
    } else {
      res.status(409).json({
        status: response.status,
        error: {
          code: response.failure_code || 409,
          message: response.failure_message || 'No se pudo crear la formación.',
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
