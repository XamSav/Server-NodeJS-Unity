const players = [
    { "id": 1, "username": "XamSav", "score": 100 },
    { "id": 2, "username": "Player2", "score": 200 }
];
const db = require('../db.js');
const bcrypt = require('bcrypt');
function findUser(username) {
    return players.find((p) => p.username === username);
}
function findUserId(id) {
    return players.find((p) => p.id === id);
}
function setPlayers(){

    db.all("SELECT users.username, scores.score FROM users JOIN scores ON users.id = scores.user_id", (err, rows) => {
        if (err) {
            console.error('Error al obtener el leaderboard:', err);
            callback([]);
            return;
        }else{
            players.splice(0, players.length);
            rows.forEach(row => {
                players.push(row);
            });
        }

        //callback(rows); // Devolver los jugadores con las puntuaciones
    });
/*
    const stmt = db.prepare("SELECT username, id FROM users"); //Agrupar con Score
    stmt.all((err, rows) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
        } else {
            players.splice(0, players.length);
            rows.forEach(row => {
                players.push(row);
            });
        }
    });
    const stmtScore = db.prepare("SELECT * FROM scores"); //Agrupar con Score
    stmtScore.all((err, rows) => {
        if (err) {
            console.error('Error al obtener las puntuaciones:', err);
        } else {
            rows.forEach(row => {
                findUserId(row.user_id).score = row.score
            });
        }
    });

    stmt.finalize();
    */
}

function addUser(user) {
    const newUser = {
        id: 0,
        username: user.username,
        password: user.password,
        score : 0
    };
    
    // Hashear la contraseña antes de guardarla
    bcrypt.hash(newUser.password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al hashear la contraseña:', err);
            return;
        }
        console.log(newUser.username);
        console.log(newUser.password);
        // Insertar el usuario en la base de datos
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)", [newUser.username, newUser.password]);
        stmt.run(newUser.username, newUser.password, function(err) {
            if (err) {
                console.error('Error al registrar el usuario:', err);
            } else {
                console.log(`Usuario registrado con éxito, ID: ${this.lastID}`);
                const stmtScore = db.prepare("INSERT INTO scores (user_id, score) VALUES (?, ?)", [this.lastID, 0]);
                stmtScore.run(this.lastID, 0, function(err) {
                    if (err) {
                        console.error('Error al registrar la puntuación:', err);
                    } else {
                        console.log(`Puntuación registrada con éxito, ID: ${this.lastID}`);
                    }
                });
                stmtScore.finalize();
            }
        });
        stmt.finalize();
    });
    players.push(newUser);
}
function getUsers() {
    // Devolver solo el nombre y la puntuación de cada jugador
    return players.map(player => ({
        username: player.username,
        score: player.score
    }));
}

module.exports = { findUser, addUser, getUsers, setPlayers };
