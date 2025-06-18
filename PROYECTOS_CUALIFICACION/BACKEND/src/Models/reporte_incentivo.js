const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Reporte periódico que el docente debe subir para justificar su incentivo.
 */
const ReporteIncentivo = sequelize.define('ReporteIncentivo', {
  id_reporte_incentivo: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  id_docente_incentivo: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha_envio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'VALIDADO', 'RECHAZADO'),
    defaultValue: 'PENDIENTE',
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Reporte_Incentivo',
  timestamps: false,
});

module.exports = ReporteIncentivo; 