const insertar = require('./insertar');
const listar = require('./listar');
const actualizar = require('./actualizar');
const eliminar = require('./eliminar');
const asignar = require('./asignar');
const actualizarAsignacion = require('./actualizarAsignacion');
const eliminarAsignacion = require('./eliminarAsignacion');
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
  actualizarAsignacion,
  eliminarAsignacion,
  listarPorDocente,
  listarDocentesAsignados,
  obtenerEstadisticas,
  calcularFechasReporte,
  obtenerMiProgreso,
}; 