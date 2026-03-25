const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM juegos', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error BD' });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM juegos WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { nombre, genero, precio } = req.body;

  if (!nombre || !genero || isNaN(precio)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  db.run(
    'INSERT INTO juegos(nombre, genero, precio) VALUES (?, ?, ?)',
    [nombre, genero, precio],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error al crear' });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.put('/:id', (req, res) => {
  const { nombre, genero, precio } = req.body;

  if (!nombre || !genero || isNaN(precio)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  db.run(
    'UPDATE juegos SET nombre=?, genero=?, precio=? WHERE id=?',
    [nombre, genero, precio, req.params.id],
    function () {
      if (this.changes === 0) return res.status(404).json({ message: 'No encontrado' });
      res.json({ message: 'Actualizado' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM juegos WHERE id=?', [req.params.id], function () {
    if (this.changes === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  });
});

module.exports = router;