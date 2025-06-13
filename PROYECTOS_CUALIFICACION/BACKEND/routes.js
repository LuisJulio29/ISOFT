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
  router.post("/usuarios/insertar", usuariosController.insertar);
  router.get("/usuarios/listar", verifyToken, usuariosController.listar);
  router.put("/usuarios/actualizar/:id",verifyToken, usuariosController.actualizar);
  router.delete("/usuarios/eliminar/:id", usuariosController.eliminar);

  //Formaciones
  router.post("/formacion/insertar", verifyToken, formacionesController.insertar);
  router.get("/formacion/listar", verifyToken, formacionesController.listar);
  router.put("/formacion/actualizar/:id", verifyToken, formacionesController.actualizar);
  router.delete("/formacion/eliminar/:id", formacionesController.eliminar);
  router.post("/formacion/cargaMasiva", verifyToken,upload.single('archivo'), formacionesController.cargarFormacionesMasivo);

  //Roles
  router.post('/roles/:idRol/interfaces', verifyToken, rolesInterfacesController.guardar);
  router.get('/roles/:idRol/interfaces', verifyToken, rolesInterfacesController.buscar);
  router.get("/roles", verifyToken, rolesInterfacesController.listar);

  return router; 
};

module.exports = rutas;
