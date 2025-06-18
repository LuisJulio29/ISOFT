const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const formacionRepo = require('../../repositories/formaciones');
const constants = require('../../../constants');

async function handler (req, res) {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Archivo no recibido correctamente." });
    }
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath, { type: 'file', raw: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const formaciones = data.map((row) => ({
      nombre_formacion: row.nombre_formacion,
      periodo: row.periodo,
      linea_cualificacion: row.linea_cualificacion,
      numero_horas: parseInt(row.numero_horas),
      fecha_inicio: new Date(row.fecha_inicio),
      fecha_terminacion: new Date(row.fecha_terminacion),
      observaciones: row.observaciones || '',
    }));
    const resultado = await formacionRepo.cargarMasivamente(formaciones);
    fs.unlinkSync(filePath);

    if (resultado.status === constants.SUCCEEDED_MESSAGE) {
      
      return res.status(201).json({ message: 'Carga masiva exitosa', data: resultado.data });
    } else {
      return res.status(500).json({ error: resultado.failure_message });
    }

  } catch (error) {
    console.error('Error al procesar archivo:', error);
    return res.status(500).json({ error: 'Error inesperado al procesar el archivo' });
  }
};

module.exports = [handler];
