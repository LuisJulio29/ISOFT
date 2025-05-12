const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes')();
const app = express();
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json({ limit: '600mb' }));     // Para JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para formularios


var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} 
 
 
app.use(cors(corsOptions));
// Cargar api routes
app.use('/', routes);

//Handling errors
app.use(async (error, req, res, next) => {
  console.error(`${req.method} ${req.url} ${error.message} ${error.stack}`);

  try {
    await console.error(`Error:\n*${req.method} ${req.url} \n*Stack Traze: * ${error.message} ${error.stack}`);
  } catch (error) {
    console.error(error);
  }
  try {
    return res.status(500).send({ errors: [{ message: error.message }] });
  } catch (error) {
    return next(error);
  }

});

module.exports = app;
