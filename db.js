const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear o abrir la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'game.db'), (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err);
    } else {
        console.log('Base de datos abierta con éxito');
    }
});

// Crear las tablas si no existen
db.serialize(() => {
    // Tabla de usuarios
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");

    // Tabla de puntuaciones
    db.run("CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, score INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))");
});

module.exports = db;
