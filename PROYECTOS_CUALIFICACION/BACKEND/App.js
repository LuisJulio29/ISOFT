const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes')(); // Asumiendo que exportas una función
const app = express();

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

app.use(express.json({ limit: '600mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware personalizado para manejar URLs con caracteres especiales
app.use('/uploads', (req, res, next) => {
  // Decodificar la URL para manejar caracteres especiales
  req.url = decodeURIComponent(req.url);
  next();
});

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', routes);

app.use((error, req, res, next) => {
  console.error(`${req.method} ${req.url} | ${error.message}`);
  console.error(error.stack);

  res.status(500).send({
    errors: [{ message: error.message }],
  });
});

module.exports = app;
