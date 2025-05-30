const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que esta ruta sea correcta

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

// Asociaciones (Relaciones entre modelos)
const { Usuario, Rol, Interface, Rol_Interface, Docente, Administrador, Formacion, Cualificacion } = db;

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

if (Docente && Usuario) {
  Docente.belongsTo(Usuario, { foreignKey: 'id_usuario' });
  Usuario.hasOne(Docente, { foreignKey: 'id_usuario' });
}

if (Administrador && Usuario) {
  Administrador.belongsTo(Usuario, { foreignKey: 'id_usuario' });
  Usuario.hasOne(Administrador, { foreignKey: 'id_usuario' });
}

if (Cualificacion && Formacion && Docente) {
  Cualificacion.belongsTo(Docente, { foreignKey: 'cedula_docente' });
  Docente.hasMany(Cualificacion, { foreignKey: 'cedula_docente' });

  Cualificacion.belongsTo(Formacion, { foreignKey: 'id_formacion' });
  Formacion.hasMany(Cualificacion, { foreignKey: 'id_formacion' });
}

// Exportar Sequelize, la instancia y todos los modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
