const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const requests = require("request");
const constants = require('../../../constants');
const objModel = require( '../../Models/usuarios/usuarios');

const repo = {

  validarIngreso: async (findObject) => {
    try {
      const { Login, Clave } = findObject;

      // Buscar usuario por Login (Usuario)
      const user = await objModel.findOne(
        { Usuario: { $regex: Login, $options: "i" } },
        {
          _id: 1,
          Correo: 1,
          PrimerNombre: 1,
          NombreCompleto: 1,
          NumeroIdentificacion: 1,
          TipoIdentificacion: 1,
          IdRol: 1,
          RolNombre: 1,
          PrimerApellido: 1,
        }
      ).populate("IdRol");

      // Usuario no encontrado
      if (!user) {
        return {
          status: constants.SUCCEEDED_MESSAGE,
          usuario: [],
          token: null,
          failure_code: null,
          failure_message: "Usuario o contraseña incorrectos."
        };
      }

      // Validar contraseña
      const isPasswordValid = await bcrypt.compare(Clave, user.Clave);
      if (!isPasswordValid) {
        return {
          status: constants.SUCCEEDED_MESSAGE,
          usuario: [],
          token: null,
          failure_code: null,
          failure_message: "Usuario o contraseña incorrectos."
        };
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user._id,
          usuario: user.Usuario,
          rol: user.RolNombre
        },
        constants.TOKEN_SECRET,
        { expiresIn: "6h" }
      );

      // Retornar respuesta
      return {
        status: constants.SUCCEEDED_MESSAGE,
        usuario: [user],
        token,
        failure_code: null,
        failure_message: null
      };

    } catch (error) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        usuario: [],
        token: null,
        failure_code: error.code || 500,
        failure_message: error.message || "Error interno del servidor."
      };
    }
  }

}
module.exports = repo