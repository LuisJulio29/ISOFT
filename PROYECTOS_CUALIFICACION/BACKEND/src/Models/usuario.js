const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;
