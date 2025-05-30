const express = require("express");
const router = express.Router();
const multer = require("multer");
const constants = require("./constants");
const verifyToken = require('./src/Middlewares/authentication');

const rutas = () => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Controladores
  const interfacesController = require("./src/Controllers/interfaces");
  const usuariosController = require("./src/Controllers/usuarios");
  const loginController = require("./src/Controllers/login");
  const formacionesController = require('./src/Controllers/formaciones')
  // Ruta base
  router.get("/", (req, res) => {
    res.status(200).json({ response: "El back está backeando" });
  });

  // Login
  router.post("/login", loginController.login);

  // Interfaces
  router.get("/interfaces", verifyToken, interfacesController.buscar);

  // Usuarios
  router.post("/usuarios/insertar", usuariosController.insertar);
  router.get("/usuarios/listar", verifyToken, usuariosController.listar);
  router.put("/usuarios/actualizar/:id", usuariosController.actualizar);

  //Formaciones
  router.post("/formacion/insertar", formacionesController.insertar);
  router.get("/formacion/listar",  formacionesController.listar);
  router.put("/formacion/actualizar/:id", formacionesController.actualizar);
  router.post("/formacion/eliminar/:id", formacionesController.eliminar)
  
  return router;
};

module.exports = rutas;
