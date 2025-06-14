// repositories/usuarioDocente.js
const { Usuario_Docente, Usuario, Docente, Cualificacion, Formacion } = require('../../Models');
const constants = require('../../../constants');
// const db = require('../../Models');
// console.log("Modelos disponibles:", Object.keys(db));

const repo = {
  listarConDetalle: async () => {
    try {
      const data = await Usuario_Docente.findAll({
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombres', 'apellidos']
          },
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'nombre', 'apellidos', 'numero_identificacion']
          },
          {
            model: Cualificacion,
            as: 'cualificaciones',
            include: {
              model: Formacion,
              as: 'formacion',
              attributes: ['id', 'nombre_formacion', 'nivel']
            }
          }
        ]
      });

      return {
        status: constants.SUCCEEDED_MESSAGE,
        usuarios_docentes: data
      };
    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: error.code || 500,
        failure_message: error.message || "Error al listar usuarios_docentes."
      };
    }
  }
};

module.exports = repo;
