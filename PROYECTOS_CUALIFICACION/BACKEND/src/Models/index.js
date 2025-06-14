const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

const basename = path.basename(__filename);
const modelsPath = __dirname;

// Cargar todos los modelos del directorio actual
fs.readdirSync(modelsPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(modelsPath, file));
    db[model.name] = model;
  });

// Desestructurar modelos
const {
  Usuario,
  Usuario_Docente,
  Rol,
  Interface,
  Rol_Interface,
  Docente,
  Formacion,
  Cualificacion
} = db;

// --- Relaciones básicas ---
if (Usuario && Rol) {
  Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });
  Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
}

if (Rol_Interface && Rol && Interface) {
  Rol_Interface.belongsTo(Rol, { foreignKey: 'id_rol' });
  Rol.hasMany(Rol_Interface, { foreignKey: 'id_rol' });

  Rol_Interface.belongsTo(Interface, { foreignKey: 'id_interface' });
  Interface.hasMany(Rol_Interface, { foreignKey: 'id_interface' });
}

// --- Usuario ↔ Docente (muchos a muchos con tabla intermedia Usuario_Docente) ---
Usuario.belongsToMany(Docente, {
  through: Usuario_Docente,
  foreignKey: 'id_usuario',
  otherKey: 'id_docente',
  as: 'docentes'
});
Docente.belongsToMany(Usuario, {
  through: Usuario_Docente,
  foreignKey: 'id_docente',
  otherKey: 'id_usuario',
  as: 'usuarios'
});

// --- Usuario_Docente -> relaciones individuales ---
Usuario_Docente.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario_Docente.belongsTo(Docente, { foreignKey: 'id_docente', as: 'docente' });
Usuario.hasMany(Usuario_Docente, { foreignKey: 'id_usuario', as: 'usuario_docente' });
Docente.hasMany(Usuario_Docente, { foreignKey: 'id_docente', as: 'usuario_docente' });

// --- Cualificación ↔ Usuario_Docente (1:N) ---
Usuario_Docente.hasMany(Cualificacion, {
  foreignKey: 'id_docente',
  as: 'cualificaciones'
});
Cualificacion.belongsTo(Usuario_Docente, {
  foreignKey: 'id_usuario_docente',
  as: 'usuario_docente'
});

// --- Formación ↔ Cualificación (1:N) ---
Formacion.hasMany(Cualificacion, { foreignKey: 'id_formacion', as: 'cualificaciones' });
Cualificacion.belongsTo(Formacion, { foreignKey: 'id_formacion', as: 'formacion' });

// Finalizar conexión
db.sequelize = sequelize;

module.exports = db;
