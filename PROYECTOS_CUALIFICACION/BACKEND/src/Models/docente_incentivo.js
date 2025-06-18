const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Relación Docente ↔ Incentivo.
 * Un docente puede tener 0 o 1 incentivos vigentes.
 */
const DocenteIncentivo = sequelize.define('DocenteIncentivo', {
  id_docente_incentivo: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  id_docente: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  id_incentivo: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('VIGENTE', 'FINALIZADO'),
    defaultValue: 'VIGENTE',
  },
}, {
  tableName: 'Docente_Incentivo',
  timestamps: false,
});

module.exports = DocenteIncentivo; 