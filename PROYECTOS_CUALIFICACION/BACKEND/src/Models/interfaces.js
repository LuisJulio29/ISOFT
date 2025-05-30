const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Interface = sequelize.define('Interface', {
  id_interface: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ruta: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'Interface',
  timestamps: false
});

module.exports = Interface;
