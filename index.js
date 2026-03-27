require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// AUTH
app.use((req, res, next) => {
  const apiKey = req.headers['password'];

  if (!apiKey) {
    return res.status(401).json({ success:false, message:'Falta password' });
  }

  if (apiKey !== process.env.API_PASSWORD) {
    return res.status(403).json({ success:false, message:'Password incorrecta' });
  }

  next();
});

app.use('/usuarios', require('./routes/usuarios'));
app.use('/juegos', require('./routes/juegos'));
app.use('/compras', require('./routes/compras'));
app.use('/detalle', require('./routes/detalle_compras'));
app.use('/resenias', require('./routes/resenias'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));