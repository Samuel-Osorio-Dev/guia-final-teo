const express = require('express');
const router = express.Router();
const db = require('../db');

// GET con filtros
router.get('/', (req, res) => {
  let query = 'SELECT * FROM resenias WHERE 1=1';
  let params = [];

  Object.entries(req.query).forEach(([key, value]) => {
    query += ` AND ${key} = ?`;
    params.push(value);
  });

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error BD' });
    res.json({ success: true, total: rows.length, data: rows });
  });
});

// GET por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM resenias WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST
router.post('/', (req, res) => {
  const { usuario_id, juego_id, comentario, calificacion } = req.body;

  if (
    usuario_id === undefined ||
    juego_id === undefined ||
    calificacion === undefined ||
    isNaN(usuario_id) ||
    isNaN(juego_id) ||
    isNaN(calificacion)
  ) {
    return res.status(400).json({ success: false, message: 'Datos inválidos' });
  }

  if (calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ success: false, message: 'Calificación debe ser entre 1 y 5' });
  }

  db.get('SELECT * FROM usuarios WHERE id=?', [usuario_id], (err, usuario) => {
    if (!usuario) return res.status(400).json({ success: false, message: 'Usuario no existe' });

    db.get('SELECT * FROM juegos WHERE id=?', [juego_id], (err, juego) => {
      if (!juego) return res.status(400).json({ success: false, message: 'Juego no existe' });

      db.run(
        'INSERT INTO resenias(usuario_id,juego_id,comentario,calificacion) VALUES (?,?,?,?)',
        [usuario_id, juego_id, comentario || '', calificacion],
        function (err) {
          if (err) return res.status(500).json({ success: false, message: 'Error al crear reseña' });
          res.status(201).json({ success: true, message: 'Reseña creada', data: { id: this.lastID } });
        }
      );
    });
  });
});

// PUT
router.put('/:id', (req, res) => {
  db.get('SELECT * FROM resenias WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });

    const usuario_id = req.body.usuario_id ?? row.usuario_id;
    const juego_id = req.body.juego_id ?? row.juego_id;
    const comentario = req.body.comentario ?? row.comentario;
    const calificacion = req.body.calificacion ?? row.calificacion;

    if (isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ success: false, message: 'Calificación debe ser entre 1 y 5' });
    }

    db.get('SELECT * FROM usuarios WHERE id=?', [usuario_id], (err, usuario) => {
      if (!usuario) return res.status(400).json({ success: false, message: 'Usuario no existe' });

      db.get('SELECT * FROM juegos WHERE id=?', [juego_id], (err, juego) => {
        if (!juego) return res.status(400).json({ success: false, message: 'Juego no existe' });

        db.run(
          'UPDATE resenias SET usuario_id=?,juego_id=?,comentario=?,calificacion=? WHERE id=?',
          [usuario_id, juego_id, comentario, calificacion, req.params.id],
          function () {
            res.json({ success: true, message: 'Actualizado', data: { id: req.params.id, usuario_id, juego_id, comentario, calificacion } });
          }
        );
      });
    });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM resenias WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, message: 'Eliminado' });
  });
});

module.exports = router;
