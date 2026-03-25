const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas
router.get('/', (req, res) => {
  db.all('SELECT * FROM resenias', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error en BD'
      });
    }

    res.json({
      success: true,
      total: rows.length,
      data: rows
    });
  });
});

// POST crear reseña
router.post('/', (req, res) => {
  const { usuario_id, juego_id, comentario, calificacion } = req.body;

  // 🔥 VALIDACIONES REALES
  if (
    usuario_id === undefined ||
    juego_id === undefined ||
    calificacion === undefined ||
    isNaN(usuario_id) ||
    isNaN(juego_id) ||
    isNaN(calificacion)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos'
    });
  }

  if (calificacion < 1 || calificacion > 5) {
    return res.status(400).json({
      success: false,
      message: 'Calificación debe ser entre 1 y 5'
    });
  }

  // 🔥 VALIDAR FK usuario
  db.get('SELECT * FROM usuarios WHERE id=?', [usuario_id], (err, usuario) => {
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no existe'
      });
    }

    // 🔥 VALIDAR FK juego
    db.get('SELECT * FROM juegos WHERE id=?', [juego_id], (err, juego) => {
      if (!juego) {
        return res.status(400).json({
          success: false,
          message: 'Juego no existe'
        });
      }

      // 🔥 INSERT
      db.run(
        'INSERT INTO resenias(usuario_id, juego_id, comentario, calificacion) VALUES (?, ?, ?, ?)',
        [usuario_id, juego_id, comentario || '', calificacion],
        function (err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error al crear reseña'
            });
          }

          res.status(201).json({
            success: true,
            message: 'Reseña creada',
            data: { id: this.lastID }
          });
        }
      );
    });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM resenias WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'No encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Eliminado'
    });
  });
});

module.exports = router;