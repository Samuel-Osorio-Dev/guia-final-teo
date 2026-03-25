const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM detalle_compras', [], (err, rows) => {
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { compra_id, juego_id } = req.body;

  if (!compra_id || !juego_id) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  db.run(
    'INSERT INTO detalle_compras(compra_id, juego_id) VALUES (?, ?)',
    [compra_id, juego_id],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM detalle_compras WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  });
});

module.exports = router;