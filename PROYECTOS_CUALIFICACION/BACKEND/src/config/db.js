// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TuBaseDeDatos', 'TuUsuario', 'TuContraseña', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  logging: false
});

module.exports = sequelize;
