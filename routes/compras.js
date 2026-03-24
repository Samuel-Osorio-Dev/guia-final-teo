const express = require('express');
const router = express.Router();
const db = require('../db');

// POST crear compra
router.post('/', (req, res) => {
  const { usuario_id, fecha } = req.body;

  if (!usuario_id || !fecha) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  // Validación de clave foránea
  db.get('SELECT * FROM usuarios WHERE id = ?', [usuario_id], (err, user) => {
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

module.exports = router;