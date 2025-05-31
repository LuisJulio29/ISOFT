const express = require('express');
const cors = require('cors');
const routes = require('./routes')(); // Asumiendo que exportas una función
const app = express();

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

app.use(express.json({ limit: '600mb' }));
app.use(express.urlencoded({ extended: true }));

  
app.use('/', routes);

app.use((error, req, res, next) => {
  console.error(`${req.method} ${req.url} | ${error.message}`);
  console.error(error.stack);

  res.status(500).send({
    errors: [{ message: error.message }],
  });
});

module.exports = app;
