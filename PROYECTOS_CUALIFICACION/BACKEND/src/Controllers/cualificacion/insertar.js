const repo = require('../../repositories/cualificacion');
const constants = require('../../../constants');

async function handler(req, res) {
  const datos = req.body;
  const response = await repo.insertar(datos);
  return res.status(200).json(response);
}

module.exports = handler;
