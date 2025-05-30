const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cualificacion = sequelize.define('Cualificacion', {
  id_cualificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  cedula_docente: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  id_formacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  año_cursado: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Cualificacion',
  timestamps: false
});

module.exports = Cualificacion;
