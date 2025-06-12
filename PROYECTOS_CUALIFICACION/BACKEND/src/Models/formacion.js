const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Formacion = sequelize.define('Formacion', {
  id_formacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nombre_formacion: DataTypes.STRING(100),
  periodo: DataTypes.STRING(20),
  linea_cualificacion: DataTypes.STRING(100),
  numero_horas: DataTypes.INTEGER,
  fecha_inicio: DataTypes.DATE,
  fecha_terminacion: DataTypes.DATE,
  observaciones: DataTypes.TEXT
}, {
  tableName: 'Formacion',
  timestamps: false
});

module.exports = Formacion;
