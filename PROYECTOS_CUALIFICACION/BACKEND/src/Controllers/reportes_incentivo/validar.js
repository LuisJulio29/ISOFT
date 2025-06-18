const reportesRepo = require('../../Repositories/reportes_incentivo');
const constants = require('../../../constants');

async function handler(req, res) {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body; // estado = VALIDADO | RECHAZADO
    if (!['VALIDADO', 'RECHAZADO'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const response = await reportesRepo.validar(id, { estado, observaciones });

    if (response.status === constants.SUCCEEDED_MESSAGE) {
      return res.status(200).json({ reporte: response.reporte });
    }

    return res.status(response.failure_code || 500).json({ message: response.failure_message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = [handler]; 