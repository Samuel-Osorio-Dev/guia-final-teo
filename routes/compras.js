const express = require('express');
const router = express.Router();
const db = require('../db');

// GET con filtros
router.get('/', (req, res) => {
  let query = 'SELECT * FROM compras WHERE 1=1';
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
  db.get('SELECT * FROM compras WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST
router.post('/', (req, res) => {
  const { usuario_id, fecha } = req.body;

  if (!usuario_id || !fecha) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  db.get('SELECT * FROM usuarios WHERE id=?', [usuario_id], (err, user) => {
    if (!user) return res.status(400).json({ success: false, message: 'Usuario no existe' });

    db.run('INSERT INTO compras(usuario_id,fecha) VALUES (?,?)',
      [usuario_id, fecha],
      function () {
        res.status(201).json({ success: true, message: 'Compra creada', data: { id: this.lastID } });
      });
  });
});

// PUT
router.put('/:id', (req, res) => {
  db.get('SELECT * FROM compras WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });

    const usuario_id = req.body.usuario_id ?? row.usuario_id;
    const fecha = req.body.fecha ?? row.fecha;

    db.get('SELECT * FROM usuarios WHERE id=?', [usuario_id], (err, user) => {
      if (!user) return res.status(400).json({ success: false, message: 'Usuario no existe' });

      db.run('UPDATE compras SET usuario_id=?,fecha=? WHERE id=?',
        [usuario_id, fecha, req.params.id],
        function () {
          res.json({ success: true, message: 'Actualizado', data: { id: req.params.id, usuario_id, fecha } });
        });
    });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM compras WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, message: 'Eliminado' });
  });
});

module.exports = router;
