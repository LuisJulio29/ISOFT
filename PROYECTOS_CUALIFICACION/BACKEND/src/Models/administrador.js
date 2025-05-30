const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Administrador = sequelize.define('Administrador', {
  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Administrador',
  timestamps: false
});

module.exports = Administrador;
