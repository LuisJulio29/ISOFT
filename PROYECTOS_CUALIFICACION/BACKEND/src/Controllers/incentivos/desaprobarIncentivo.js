const incentivosRepo = require('../../Repositories/incentivos');

module.exports = async (req, res) => {
  const { id_docente_incentivo } = req.params;
  const { observaciones } = req.body;
  try {
    const respuesta = await incentivosRepo.desaprobarIncentivo(id_docente_incentivo, observaciones);
    if (respuesta.status === 'SUCCEEDED') {
      return res.status(200).json({ certificado: respuesta.certificado });
    }
    return res.status(respuesta.failure_code || 400).json({ message: respuesta.failure_message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 