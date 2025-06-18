const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Modelo Incentivo
 * Representa los beneficios como comisiones de estudio o años sabáticos.
 */
const Incentivo = sequelize.define('Incentivo', {
  id_incentivo: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('COMISION_ESTUDIO', 'ANIO_SABATICO'),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  frecuencia_informe_dias: {
    // Cada cuántos días debe enviar informe el profesor
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
    defaultValue: 'ACTIVO',
  },
}, {
  tableName: 'Incentivo',
  timestamps: false,
});

module.exports = Incentivo; 