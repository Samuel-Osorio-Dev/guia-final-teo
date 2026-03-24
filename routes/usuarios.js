const express = require('express');
const router = express.Router();
const db = require('../db');

// GET → obtener todos los usuarios
router.get('/', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(rows); // responde en JSON
  });
});

// GET por ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  });
});

// POST → crear usuario
router.post('/', (req, res) => {
  const { nombre, email } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !email) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  // Validación de email único
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, existing) => {
    if (existing) return res.status(400).json({ message: 'Email ya existe' });

    db.run(
      'INSERT INTO usuarios(nombre, email) VALUES (?, ?)',
      [nombre, email],
      function () {
        res.status(201).json({ id: this.lastID }); // creado
      }
    );
  });
});

// PUT → actualizar usuario
router.put('/:id', (req, res) => {
  const { nombre, email } = req.body;

  db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: 'No existe' });

    db.run(
      'UPDATE usuarios SET nombre=?, email=? WHERE id=?',
      [nombre, email, req.params.id],
      () => res.json({ message: 'Actualizado' })
    );
  });
});

// DELETE → eliminar usuario
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ message: 'No existe' });

    db.run('DELETE FROM usuarios WHERE id=?', [req.params.id], () => {
      res.json({ message: 'Eliminado' });
    });
  });
});

module.exports = router;