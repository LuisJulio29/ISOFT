const insertar = require('./insertar');
const listar = require('./listar');
const actualizar = require('./actualizar');
const eliminar = require('./eliminar');
const asignar = require('./asignar');
const listarPorDocente = require('./listarPorDocente');
const listarDocentesAsignados = require('./listarDocentesAsignados');
const obtenerEstadisticas = require('./obtenerEstadisticas');
const calcularFechasReporte = require('./calcularFechasReporte');
const obtenerMiProgreso = require('./obtenerMiProgreso');

module.exports = {
  insertar,
  listar,
  actualizar,
  eliminar,
  asignar,
  listarPorDocente,
  listarDocentesAsignados,
  obtenerEstadisticas,
  calcularFechasReporte,
  obtenerMiProgreso,
}; 