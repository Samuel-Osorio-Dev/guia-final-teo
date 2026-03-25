const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM resenias', [], (err, rows) => {
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { usuario_id, juego_id, comentario, calificacion } = req.body;

  if (!usuario_id || !juego_id || isNaN(calificacion)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  db.run(
    'INSERT INTO resenias(usuario_id, juego_id, comentario, calificacion) VALUES (?, ?, ?, ?)',
    [usuario_id, juego_id, comentario, calificacion],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM resenias WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  });
});

module.exports = router;