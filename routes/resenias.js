const express = require('express');
const router = express.Router();
const db = require('../db');

// POST reseña
router.post('/', (req, res) => {
  const { usuario_id, juego_id, comentario, calificacion } = req.body;

  // Validación de calificación
  if (!usuario_id || !juego_id || isNaN(calificacion)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  db.run(
    'INSERT INTO reseñas(usuario_id, juego_id, comentario, calificacion) VALUES (?, ?, ?, ?)',
    [usuario_id, juego_id, comentario, calificacion],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
});

module.exports = router;