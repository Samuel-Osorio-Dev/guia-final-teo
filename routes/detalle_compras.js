const express = require('express');
const router = express.Router();
const db = require('../db');

// GET con filtros
router.get('/', (req, res) => {
  let query = 'SELECT * FROM detalle_compras WHERE 1=1';
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
  db.get('SELECT * FROM detalle_compras WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST
router.post('/', (req, res) => {
  const { compra_id, juego_id } = req.body;

  if (!compra_id || !juego_id) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  db.get('SELECT * FROM compras WHERE id=?', [compra_id], (err, c) => {
    if (!c) return res.status(400).json({ success: false, message: 'Compra no existe' });

    db.get('SELECT * FROM juegos WHERE id=?', [juego_id], (err, j) => {
      if (!j) return res.status(400).json({ success: false, message: 'Juego no existe' });

      db.run('INSERT INTO detalle_compras(compra_id,juego_id) VALUES (?,?)',
        [compra_id, juego_id],
        function () {
          res.status(201).json({ success: true, message: 'Detalle creado', data: { id: this.lastID } });
        });
    });
  });
});

// PUT
router.put('/:id', (req, res) => {
  db.get('SELECT * FROM detalle_compras WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });

    const compra_id = req.body.compra_id ?? row.compra_id;
    const juego_id = req.body.juego_id ?? row.juego_id;

    db.get('SELECT * FROM compras WHERE id=?', [compra_id], (err, c) => {
      if (!c) return res.status(400).json({ success: false, message: 'Compra no existe' });

      db.get('SELECT * FROM juegos WHERE id=?', [juego_id], (err, j) => {
        if (!j) return res.status(400).json({ success: false, message: 'Juego no existe' });

        db.run('UPDATE detalle_compras SET compra_id=?,juego_id=? WHERE id=?',
          [compra_id, juego_id, req.params.id],
          function () {
            res.json({ success: true, message: 'Actualizado', data: { id: req.params.id, compra_id, juego_id } });
          });
      });
    });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM detalle_compras WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, message: 'Eliminado' });
  });
});

module.exports = router;
