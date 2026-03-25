const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM compras', [], (err, rows) => {
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM compras WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { usuario_id, fecha } = req.body;

  if (!usuario_id || !fecha) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  db.get('SELECT * FROM usuarios WHERE id=?', [usuario_id], (err, user) => {
    if (!user) return res.status(400).json({ message: 'Usuario no existe' });

    db.run(
      'INSERT INTO compras(usuario_id, fecha) VALUES (?, ?)',
      [usuario_id, fecha],
      function () {
        res.status(201).json({ id: this.lastID });
      }
    );
  });
});

router.put('/:id', (req, res) => {
  const { usuario_id, fecha } = req.body;

  db.run(
    'UPDATE compras SET usuario_id=?, fecha=? WHERE id=?',
    [usuario_id, fecha, req.params.id],
    function () {
      if (this.changes === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json({ message: 'Actualizado' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM compras WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  });
});

module.exports = router;