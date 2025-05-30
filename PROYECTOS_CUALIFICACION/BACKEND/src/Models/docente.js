const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Docente = sequelize.define('Docente', {
  cedula: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombres: DataTypes.STRING(100),
  apellidos: DataTypes.STRING(100),
  facultad: DataTypes.STRING(100),
  programa_academico: DataTypes.STRING(100),
  tipo_vinculacion: DataTypes.STRING(50),
  categoria: DataTypes.STRING(50),
  nivel_formacion: DataTypes.STRING(50),
  correo: DataTypes.STRING(100),
  celular: DataTypes.STRING(20)
}, {
  tableName: 'Docente',
  timestamps: false
});

module.exports = Docente;
