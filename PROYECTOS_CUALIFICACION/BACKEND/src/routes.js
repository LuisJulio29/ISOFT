const express = require("express");
const router = express.Router();
const multer = require("multer");

module.exports = () => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Ruta base
  router.get("/", (req, res) => {
    res.status(200).json({ response: "Mongo API is working properly." });
  });

  // GET simple
  router.get("/saludo", (req, res) => {
    res.status(200).json({ mensaje: "Hola desde la API" });
  });

  // POST simple con body
  router.post("/crear", (req, res) => {
    const datos = req.body;
    res.status(201).json({ mensaje: "Datos recibidos", datos });
  });

  return router;
};
