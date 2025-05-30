const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const requests = require("request");
const constants = require('../../../constants');
const objModel = require( '../../Models/usuario');

const repo = {

  insertar: async (usuario) => {
    try {
      const existente = await objModel.findOne({ where: { nombre_usuario: usuario.nombre_usuario } });
      if (existente) {
        return {
          status: constants.SUCCEEDED_MESSAGE,
          mensaje: "El usuario ya existe.",
          failure_code: 409,
          failure_message: "El usuario ya existe."
        };
      }

      const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
      const nuevo = await objModel.create({
        nombre_usuario: usuario.nombre_usuario,
        contraseña: hashedPassword,
        id_rol: usuario.id_rol
      });

      return {
        status: constants.SUCCEEDED_MESSAGE,
        usuario: nuevo,
        failure_code: null,
        failure_message: null
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        mensaje: "Error al crear el usuario.",
        failure_code: error.code || 500,
        failure_message: error.message || "Error interno del servidor."
      };
    }
  },

  listar: async () => {
    try {
      const usuarios = await objModel.findAll();
      return {
        status: constants.SUCCEEDED_MESSAGE,
        usuarios
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al listar usuarios."
      };
    }
  },

  actualizar: async (id_usuario, datos) => {
    try {
      const user = await objModel.findByPk(id_usuario);
      if (!user) {
        return {
          status: 'error',
          mensaje: 'Usuario no encontrado.',
          failure_code: 404
        };
      }

      if (datos.contraseña) {
        datos.contraseña = await bcrypt.hash(datos.contraseña, 10);
      }

      await user.update(datos);

      return {
        status: constants.SUCCEEDED_MESSAGE,
        usuario: user
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al actualizar el usuario."
      };
    }
  }
};

module.exports = repo;