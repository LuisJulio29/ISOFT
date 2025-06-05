const express = require("express");
const router = express.Router();
const multer = require("multer");
const constants = require("./constants");
const verifyToken = require('./src/Middlewares/authentication');

const rutas = () => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Controladores}
  const usuariosController = require("./src/Controllers/usuarios"); 
  const loginController = require("./src/Controllers/login");
  const formacionesController = require('./src/Controllers/formaciones')
  const interfacesControllerBuscar = require('./src/controllers/interfaces/buscar');
  const interfacesControllerActualizar = require('./src/controllers/interfaces/actualizar');

  // Ruta base
  router.get("/", (req, res) => {
    res.status(200).json({ response: "El back está backeando" });
  });

  // Login
  router.post("/login", loginController.login);

  // Interfaces
  router.get('/interfaces/buscar', verifyToken, interfacesControllerBuscar);
  router.put('/interfaces/actualizar', verifyToken, interfacesControllerActualizar);

  // Usuarios
  router.post("/usuarios/insertar", usuariosController.insertar);
  router.get("/usuarios/listar", verifyToken, usuariosController.listar);
  router.put("/usuarios/actualizar/:id",verifyToken, usuariosController.actualizar);
  router.delete("/usuarios/eliminar/:id", usuariosController.eliminar)

  //Formaciones
  router.post("/formacion/insertar", verifyToken, formacionesController.insertar);
  router.get("/formacion/listar", verifyToken, formacionesController.listar);
  router.put("/formacion/actualizar/:id", verifyToken, formacionesController.actualizar);
  router.delete("/formacion/eliminar/:id", formacionesController.eliminar)

  return router;
};

module.exports = rutas;
