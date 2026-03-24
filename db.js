// Importa sqlite3
const sqlite3 = require('sqlite3').verbose();

// Crea la base de datos (archivo database.db)
const db = new sqlite3.Database('./database.db');

// Ejecuta las consultas en orden
db.serialize(() => {

  // Tabla usuarios
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- clave primaria
    nombre TEXT NOT NULL,                 -- campo obligatorio
    email TEXT UNIQUE NOT NULL            -- no se puede repetir
  )`);

  // Tabla juegos
  db.run(`CREATE TABLE IF NOT EXISTS juegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    genero TEXT NOT NULL,
    precio REAL CHECK(precio > 0) -- no permite valores negativos
  )`);

  // Tabla compras (relación con usuarios)
  db.run(`CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id) -- clave foránea
  )`);

  // Tabla detalle (relación con compras y juegos)
  db.run(`CREATE TABLE IF NOT EXISTS detalle_compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_id INTEGER NOT NULL,
    juego_id INTEGER NOT NULL,
    FOREIGN KEY(compra_id) REFERENCES compras(id),
    FOREIGN KEY(juego_id) REFERENCES juegos(id)
  )`);

  // Tabla reseñas (relación con usuarios y juegos)
  db.run(`CREATE TABLE IF NOT EXISTS reseñas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    juego_id INTEGER NOT NULL,
    comentario TEXT,
    calificacion INTEGER CHECK(calificacion >= 1 AND calificacion <= 5),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(juego_id) REFERENCES juegos(id)
  )`);

});

module.exports = db;