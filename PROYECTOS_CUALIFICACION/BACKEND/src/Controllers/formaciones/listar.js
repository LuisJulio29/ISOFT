const formacionRepository = require('../../repositories/formaciones');
const constants = require('../../../constants');

async function handler(req, res, next) {
  try {
    const response = await formacionRepository.listar();

    res.status(200).json({
      status: response.status,
      formaciones: response.formaciones,
    });

  } catch (error) {
    res.status(500).json({
      status: constants.INTERNAL_ERROR_MESSAGE,
      error: {
        code: error.code || 500,
        message: error.message || 'Error al listar formaciones.',
      },
    });
  }
}

module.exports = [handler];
