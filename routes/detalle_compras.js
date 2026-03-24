const express = require('express');
const router = express.Router();
const db = require('../db');

// POST detalle
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

module.exports = router;