const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos
router.get('/', (req, res) => {
  db.all('SELECT * FROM juegos', [], (err, rows) => {
    res.json(rows);
  });
});

// POST crear juego
router.post('/', (req, res) => {
  const { nombre, genero, precio } = req.body;

  // Validación de tipo numérico
  if (!nombre || !genero || isNaN(precio)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  db.run(
    'INSERT INTO juegos(nombre, genero, precio) VALUES (?, ?, ?)',
    [nombre, genero, precio],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
});

module.exports = router;