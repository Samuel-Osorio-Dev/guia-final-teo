// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const app = express();

// Middleware que permite recibir datos en formato JSON (req.body)
app.use(express.json());

// Middleware de autenticación global
app.use((req, res, next) => {
  // Obtiene la contraseña enviada en los headers
  const apiKey = req.headers['password'];

  // Si no envía password → error 401
  if (!apiKey) return res.status(401).json({
  success: false,
  message: 'Falta password'
});

  // Si la password es incorrecta → error 403
  if (apiKey !== process.env.API_PASSWORD) {
    return res.status(403).json({ success: false, message: 'Password incorrecta' });
  }

  // Si todo está bien → continúa a las rutas
  next();
});

// Conecta cada archivo de rutas con su endpoint
app.use('/usuarios', require('./routes/usuarios'));
app.use('/juegos', require('./routes/juegos'));
app.use('/compras', require('./routes/compras'));
app.use('/detalle', require('./routes/detalle_compras'));
app.use('/resenias', require('./routes/resenias'));

// Usa el puerto de .env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));