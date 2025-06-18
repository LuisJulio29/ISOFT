const incentivosRepo = require('../../Repositories/incentivos');
const constants = require('../../../constants');

async function handler(req, res) {
  try {
    const { id_incentivo, id_docente, fecha_inicio, fecha_fin } = req.body;
    const response = await incentivosRepo.asignar({ id_docente, id_incentivo, fecha_inicio, fecha_fin });

    if (response.status === constants.SUCCEEDED_MESSAGE) {
      return res.status(201).json({ asignacion: response.asignacion });
    }

    return res.status(response.failure_code || 500).json({ status: response.status, message: response.failure_message });
  } catch (error) {
    return res.status(500).json({ status: constants.INTERNAL_ERROR_MESSAGE, message: error.message });
  }
}

module.exports = [handler]; 