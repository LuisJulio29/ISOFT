const constants = require('../../../constants');
const { Usuario, Interface, Rol_Interface } = require('../../Models');

const repo = {

  buscarPorUsuario: async (id_usuario) => {
    try {
      const usuario = await Usuario.findByPk(id_usuario);
      if (!usuario) {
        return {
          status: constants.NOT_FOUND_ERROR_MESSAGE,
          failure_code: 404,
          failure_message: 'Usuario no encontrado',
          interfaces: []
        };
      }

      const relaciones = await Rol_Interface.findAll({
        where: { id_rol: usuario.id_rol },
        include: {
          model: Interface,
          attributes: ['id_interface', 'nombre', 'ruta', 'parent', 'Orden']
        }
      });

      const interfaces = relaciones.map(rel => rel.Interface);

      return {
        status: constants.SUCCEEDED_MESSAGE,
        interfaces
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message,
        interfaces: []
      };
    }
  },
  actualizar: async (interfaces) => {
  try {
    for (const item of interfaces) {
      await Interface.update(
        {
          nombre: item.nombre,
          ruta: item.ruta,
          parent: item.parent || null,
          Orden: item.Orden
        },
        {
          where: { id_interface: item.id_interface }
        }
      );
    }

    return {
      status: constants.SUCCEEDED_MESSAGE
    };
  } catch (error) {
    return {
      status: constants.INTERNAL_ERROR_MESSAGE,
      failure_code: error.code || 500,
      failure_message: error.message
    };
  }
},
listarTodas: async () => {
  try {
    const interfaces = await Interface.findAll({
      attributes: ['id_interface', 'nombre', 'ruta', 'parent', 'Orden']
    });

    return {
      status: constants.SUCCEEDED_MESSAGE,
      interfaces
    };
  } catch (error) {
    return {
      status: constants.INTERNAL_ERROR_MESSAGE,
      failure_code: error.code || 500,
      failure_message: error.message,
      interfaces: []
    };
  }
}


};

module.exports = repo;
