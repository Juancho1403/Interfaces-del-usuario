const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log global de todas las peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
const coloresRoutes = require('./routes/coloresRoutes');
const tamaniosFuenteRoutes = require('./routes/tamaniosFuenteRoutes');
const tipografiasRoutes = require('./routes/tipografiasRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tipografiaTamanioRoutes = require('./routes/tipografiaTamanioRoutes');
const videoRoutes = require('./routes/videoRoutes');
const imagenRoutes = require('./routes/imagenRoutes');

app.use('/api/colores', coloresRoutes);
app.use('/api/tamanios-fuente', tamaniosFuenteRoutes);
app.use('/api/tipografias', tipografiasRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tipografia-tamanio', tipografiaTamanioRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/imagenes', imagenRoutes);

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