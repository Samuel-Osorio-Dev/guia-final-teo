const express = require('express');
const router = express.Router();
const db = require('../db');

// GET con filtros
router.get('/', (req, res) => {
  let query = 'SELECT * FROM juegos WHERE 1=1';
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
  db.get('SELECT * FROM juegos WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST
router.post('/', (req, res) => {
  const { nombre, genero, precio } = req.body;

  if (!nombre || !genero || precio === undefined || isNaN(precio)) {
    return res.status(400).json({ success: false, message: 'Datos inválidos' });
  }

  db.run('INSERT INTO juegos(nombre,genero,precio) VALUES (?,?,?)',
    [nombre, genero, precio],
    function (err) {
      if (err) return res.status(500).json({ success: false, message: 'Error BD' });
      res.status(201).json({ success: true, message: 'Juego creado', data: { id: this.lastID } });
    });
});

// PUT
router.put('/:id', (req, res) => {
  db.get('SELECT * FROM juegos WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'No encontrado' });

    const nombre = req.body.nombre ?? row.nombre;
    const genero = req.body.genero ?? row.genero;
    const precio = req.body.precio ?? row.precio;

    if (isNaN(precio)) {
      return res.status(400).json({ success: false, message: 'Precio inválido' });
    }

    db.run('UPDATE juegos SET nombre=?,genero=?,precio=? WHERE id=?',
      [nombre, genero, precio, req.params.id],
      function () {
        res.json({ success: true, message: 'Actualizado', data: { id: req.params.id, nombre, genero, precio } });
      });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM juegos WHERE id=?', [req.params.id], function (err) {
    if (err) {
      if (err.message.includes('FOREIGN KEY constraint failed')) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el juego porque tiene reseñas o compras asociadas.'
        });
      }
      return res.status(500).json({ success: false, message: 'Error BD' });
    }
    if (this.changes === 0) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, message: 'Eliminado' });
  });
});

module.exports = router;
