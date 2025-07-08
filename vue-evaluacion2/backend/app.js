const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const coloresRoutes = require('./routes/coloresRoutes');
const tamaniosFuenteRoutes = require('./routes/tamaniosFuenteRoutes');
const tipografiasRoutes = require('./routes/tipografiasRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tipografiaTamanioRoutes = require('./routes/tipografiaTamanioRoutes');

app.use('/api/colores', coloresRoutes);
app.use('/api/tamanios-fuente', tamaniosFuenteRoutes);
app.use('/api/tipografias', tipografiasRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tipografia-tamanio', tipografiaTamanioRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});