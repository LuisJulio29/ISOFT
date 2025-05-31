const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const requests = require("request");
const constants = require('../../../constants');
const {Usuario, Rol} = require('../../Models');

const repo = {

  insertar: async (usuario) => {
    try {
      const existente = await Usuario.findOne({ where: { nombre_usuario: usuario.nombre_usuario } });
      if (existente) {
        return {
          status: constants.SUCCEEDED_MESSAGE,
          mensaje: "El usuario ya existe.",
          failure_code: 409,
          failure_message: "El usuario ya existe."
        };
      }

      const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
      const nuevo = await Usuario.create({
        nombre_usuario: usuario.nombre_usuario,
        contraseña: hashedPassword,
        id_rol: usuario.id_rol,
        nombre_completo: usuario.nombre_completo
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
      const usuarios = await Usuario.findAll({
        include: {
          model: Rol,
          attributes: ['nombre']
        }
      });

      const usuariosLimpios = usuarios.map(usuario => {
        const { contraseña, id_rol, Rol: rolData, ...restoUsuario } = usuario.toJSON();
        return {
          ...restoUsuario,
          rol_nombre: rolData?.nombre || null
        };
      });

      return {
        status: constants.SUCCEEDED_MESSAGE,
        usuarios: usuariosLimpios
      };
    } catch (error) {
      console.error("Error en listar:", error);
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al listar usuarios."
      };
    }
  },

  actualizar: async (id_usuario, datos) => {
    try {
      const user = await Usuario.findByPk(id_usuario);
      if (!user) {
        return {
          status: 'error',
          mensaje: 'Usuario no encontrado.',
          failure_code: 404
        };
      }

      const cambios = {};

      // Comparar campo por campo y solo agregar si cambió
      if (datos.nombre_usuario && datos.nombre_usuario !== user.nombre_usuario) {
        cambios.nombre_usuario = datos.nombre_usuario;
      }

      if (datos.nombre_completo && datos.nombre_completo !== user.nombre_completo) {
        cambios.nombre_completo = datos.nombre_completo;
      }

      // Solo actualiza contraseña si fue enviada y es distinta
      if (datos.contraseña) {
        const isSamePassword = await bcrypt.compare(datos.contraseña, user.contraseña);
        if (!isSamePassword) {
          cambios.contraseña = await bcrypt.hash(datos.contraseña, 10);
        }
      }

      // Si no hay cambios, no hacer update
      if (Object.keys(cambios).length === 0) {
        return {
          status: 'success',
          mensaje: 'No se realizaron cambios.',
          usuario: user
        };
      }

      await user.update(cambios);

      return {
        status: constants.SUCCEEDED_MESSAGE,
        mensaje: 'Usuario actualizado correctamente.',
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al actualizar el usuario."
      };
    }
  },

  eliminar: async (id_usuario) => {
  try {
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return {
        status: 'error',
        failure_code: 404,
        failure_message: 'Usuario no encontrado.',
      };
    }

    await usuario.destroy();

    return {
      status: constants.SUCCEEDED_MESSAGE,
      mensaje: 'Usuario eliminado correctamente.',
    };
  } catch (error) {
    return {
      status: constants.INTERNAL_ERROR_MESSAGE,
      failure_code: error.code || 500,
      failure_message: error.message || "Error al eliminar el usuario.",
    };
  }
}


};

module.exports = repo;