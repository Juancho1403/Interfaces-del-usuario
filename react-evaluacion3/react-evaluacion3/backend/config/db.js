const mysql = require('mysql2/promise');
// require('dotenv').config(); // Ya no es necesario para la conexión

const pool = mysql.createPool({
    host: 'localhost', // Conexión directa
    user: 'root', // Conexión directa
    password: '', // Contraseña vacía
    database: 'sitio_configuracion', // Conexión directa
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Bloque de diagnóstico para probar la conexión
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a la base de datos establecida correctamente.');
        connection.release(); // Libera la conexión
    })
    .catch(err => {
        console.error('❌ ERROR FATAL AL CONECTAR CON LA BASE DE DATOS:');
        console.error(`- Código de error: ${err.code}`);
        console.error(`- Mensaje: ${err.message}`);
        console.error('---');
        console.error('POSIBLES SOLUCIONES:');
        console.error('1. Asegúrate de que tu servidor de MySQL (XAMPP, WAMP, etc.) esté iniciado.');
        console.error('2. Revisa que los datos en tu archivo ".env" (DB_USER, DB_PASSWORD, DB_NAME) sean correctos.');
        console.error('---');
    });

module.exports = pool;