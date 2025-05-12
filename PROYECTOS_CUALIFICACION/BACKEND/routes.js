const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const constants = require("./constants");

const requestsRouter = express.Router();
module.exports = () => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  //Controladores
  const interfacesController = require("./src/Controllers/interfaces");
  const usuariosController = require("./src/Controllers/usuarios");

  // Rutas 
  requestsRouter.get("/interfaces/", interfacesController.buscar);
  router.get("/", (req, res) => {
    res.status(200).json({ response: "Mongo API is working properly." });
  });

  //Validar ingreso
  requestsRouter.post(
    "/usuarios/validarIngreso",
    usuariosController.validarIngreso
  );

  
  router.post("/login", (req, res) => {
    const fakeDocente = {
      _id: "12345",
      Usuario: "docente@gmail.com",
      NombreCompleto: "Docente Prueba",
      NumeroIdentificacion: "Usuario",
      RolNombre: "Docente"
    };
  
    const token = jwt.sign(
      { id: fakeDocente._id, name: fakeDocente.Usuario },
      constants.TOKEN_SECRET,
      { expiresIn: "6h" }
    );
  
    return res.json({
      status: constants.SUCCEEDED_MESSAGE,
      usuario: [fakeDocente],
      token,
      datosKey: [],
      failure_code: null,
      failure_message: null
    });
  });
  

  return router;
};
