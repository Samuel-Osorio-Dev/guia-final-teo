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
 
  // DATOS DE PRUEBA
  db.run(`INSERT OR IGNORE INTO usuarios(id,nombre,email) VALUES (1,'Samuel Osorio','samuel@email.com')`);
  db.run(`INSERT OR IGNORE INTO usuarios(id,nombre,email) VALUES (2,'Maria Lopez','maria@email.com')`);
 
  db.run(`INSERT OR IGNORE INTO juegos(id,nombre,genero,precio) VALUES (1,'GTA V','Accion',115)`);
  db.run(`INSERT OR IGNORE INTO juegos(id,nombre,genero,precio) VALUES (2,'FIFA 24','Deportes',100)`);
 
  db.run(`INSERT OR IGNORE INTO compras(id,usuario_id,fecha) VALUES (1,1,'2024-03-20')`);
  db.run(`INSERT OR IGNORE INTO compras(id,usuario_id,fecha) VALUES (2,2,'2024-03-21')`);
 
  db.run(`INSERT OR IGNORE INTO detalle_compras(id,compra_id,juego_id) VALUES (1,1,1)`);
  db.run(`INSERT OR IGNORE INTO detalle_compras(id,compra_id,juego_id) VALUES (2,2,2)`);
 
  db.run(`INSERT OR IGNORE INTO resenias(id,usuario_id,juego_id,comentario,calificacion) VALUES (1,1,1,'Juegazo, lo recomiendo',5)`);
  db.run(`INSERT OR IGNORE INTO resenias(id,usuario_id,juego_id,comentario,calificacion) VALUES (2,2,2,'Muy buena historia',4)`);
});
 
module.exports = db;