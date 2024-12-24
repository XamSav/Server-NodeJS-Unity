const { findUser } = require('./user-data');
const { sendError, sendResponse } = require('../utils/responder');
const { ErrorCodes } = require('./error-codes');
const { comparePassword } = require('../utils/hasher');
const db = require('../db');
/////FALTA IMPLEMENTAR BASE DATOS
function handleLogin(ws, payload) { 
    const { username, password } = payload;
    const player = findUser(username);

    if (player) {
        if (comparePassword(password, player.password)) {
            // Login exitoso
            const userData = { id: player.id, username: player.username, score: player.score };
            sendResponse(ws, 'login', { success: true, user: userData });
        } else {
            sendError(ws, ErrorCodes.INVALID_PASSWORD);
        }
    } else {
        sendError(ws, ErrorCodes.USER_NOT_FOUND);
    }
}

function loginUser(req, res){
    const { username, password } = req.body;

        // Consultar el usuario por su nombre de usuario
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
            if (err) {
                console.error('Error al obtener el usuario:', err);
                return res.status(500).json(ErrorCodes.USER_FETCH_ERROR);
                
            }
            if (!user) {
                console.log('Usuario no encontrado');
                return res.status(404).json(ErrorCodes.USER_NOT_FOUND);
            }
    
            // Comparar la contraseña con la guardada en la base de datos
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    return res.status(500).json(ErrorCodes.PASSWORD_COMPARISON_ERROR);
                }
    
                if (res) {
                    console.log('Inicio de sesión exitoso');
                    res.send(true, user.id); // Retornar el ID del usuario
                } else {
                    console.log('Contraseña incorrecta');
                    return res.status(401).json(ErrorCodes.INCORRECT_PASSWORD);
                    return res.send(false);
                }
            });
        });
}

module.exports = { handleLogin, loginUser };
