require('dotenv').config(); // Cargar variables de entorno

const app = require('./App');
const sequelize = require('./src/config/db');

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');
    await sequelize.sync({ alter: true });   // crea/actualiza tablas según modelos
    console.log('Base de datos sincronizada');

    app.listen(PORT, () => {
      console.log(`Servidor escuchando ${PORT}`);
    });

  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
})();
