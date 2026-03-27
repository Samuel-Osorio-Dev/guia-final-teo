const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
 
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
 
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )`);
 
  db.run(`CREATE TABLE IF NOT EXISTS juegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    genero TEXT NOT NULL,
    precio REAL NOT NULL CHECK(precio > 0)
  )`);
 
  db.run(`CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);
 
  db.run(`CREATE TABLE IF NOT EXISTS detalle_compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_id INTEGER NOT NULL,
    juego_id INTEGER NOT NULL,
    FOREIGN KEY(compra_id) REFERENCES compras(id),
    FOREIGN KEY(juego_id) REFERENCES juegos(id)
  )`);
 
  db.run(`CREATE TABLE IF NOT EXISTS resenias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    juego_id INTEGER NOT NULL,
    comentario TEXT,
    calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(juego_id) REFERENCES juegos(id)
  )`);
});
 
module.exports = db;