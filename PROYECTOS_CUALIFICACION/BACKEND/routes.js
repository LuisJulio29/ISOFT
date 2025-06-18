const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require('./src/Middlewares/upload');
const constants = require("./constants");
const verifyToken = require('./src/Middlewares/authentication');

const rutas = () => {
  const storage = multer.memoryStorage();

  //---------------------------------------Controladores---------------------------------------

  //Login
  const loginController = require("./src/Controllers/login");

  //Interface
  const interfacesController = require('./src/controllers/interfaces');

  //Usuario
  const usuariosController = require("./src/Controllers/usuarios");

  //Formacion
  const formacionesController = require('./src/Controllers/formaciones');

  //Roles
  const rolesInterfacesController = require('./src/controllers/roles');

  //Cualificación
  const cualificacionController = require('./src/Controllers/cualificacion');

  // Incentivos
  const incentivosController = require('./src/Controllers/incentivos');

  //Usuario Docente
  const usuarioDocenteController = require('./src/Controllers/usuario_docente');

  //---------------------------------------Rutas---------------------------------------

  // Ruta base
  router.get("/", (req, res) => {
    res.status(200).json({ response: "El back está backeando" });
  });

  // Login
  router.post("/login", loginController.login);

  // Interfaces
  router.get('/interfaces/buscar', verifyToken, interfacesController.buscar);
  router.put('/interfaces/actualizar', verifyToken, interfacesController.actualizar);

  // Usuarios
  router.post("/usuarios/insertarAdmin", usuariosController.insertarAdmin);
  router.post("/usuarios/insertarDocentes", usuariosController.insertarDocentes);
  router.get("/usuarios/listar", verifyToken, usuariosController.listar);
  router.put("/usuarios/actualizar/:id", verifyToken, usuariosController.actualizar);
  router.delete("/usuarios/eliminar/:id", usuariosController.eliminar);

  //Formaciones
  router.post("/formacion/insertar", verifyToken, formacionesController.insertar);
  router.get("/formacion/listar", verifyToken, formacionesController.listar);
  router.put("/formacion/actualizar/:id", verifyToken, formacionesController.actualizar);
  router.delete("/formacion/eliminar/:id", formacionesController.eliminar);
  router.post("/formacion/cargaMasiva", verifyToken, upload.single('archivo'), formacionesController.cargarFormacionesMasivo);

  //Roles
  router.post('/roles/:idRol/interfaces', verifyToken, rolesInterfacesController.guardar);
  router.get('/roles/:idRol/interfaces', verifyToken, rolesInterfacesController.buscar);
  router.get("/roles", verifyToken, rolesInterfacesController.listar);

  // Cualificación
  router.get('/cualificacion/listar', cualificacionController.listar);
  router.post('/cualificacion/insertar', cualificacionController.insertar);
  router.put('/cualificacion/actualizar/:id', cualificacionController.actualizar);
  router.delete('/cualificacion/eliminar/:id', cualificacionController.eliminar);

  // Incentivos
  router.post('/incentivos/insertar', verifyToken, incentivosController.insertar);
  router.get('/incentivos/listar', verifyToken, incentivosController.listar);
  router.put('/incentivos/actualizar/:id', verifyToken, incentivosController.actualizar);
  router.delete('/incentivos/eliminar/:id', verifyToken, incentivosController.eliminar);
  router.post('/incentivos/asignar', verifyToken, incentivosController.asignar);
  router.get('/incentivos/docente/:idDocente?', verifyToken, incentivosController.listarPorDocente);

  // Reportes Incentivo
  const reportesController = require('./src/Controllers/reportes_incentivo');
  const uploadPDF = require('./src/Middlewares/uploadPDF');

  router.post('/incentivos/reportes/subir', verifyToken, uploadPDF.single('archivo'), reportesController.subir);
  router.get('/incentivos/reportes/pendientes', verifyToken, reportesController.listarPendientes);
  router.put('/incentivos/reportes/:id/validar', verifyToken, reportesController.validar);

  // Usuario Docente
  router.get('/usuarioDocente/listar',  usuarioDocenteController.listarDetalle);
  return router;
};

module.exports = rutas;
