// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  PrimerNombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  Clave: {
    type: DataTypes.STRING,
    allowNull: false
  },
  RolNombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Usuarios',
  timestamps: false
});

module.exports = Usuario;
