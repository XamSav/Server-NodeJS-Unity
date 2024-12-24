const { findUser, addUser, getUsers } = require('./user-data');
const { sendError, sendResponse } = require('../utils/responder');
const { ErrorCodes } = require('./error-codes');
const { hashPassword } = require('../utils/hasher');

// Registro desde HTTP

/**
 * Registra un nuevo usuario en la base de datos.
 *
 * @param {Express.Request} req - La peticion HTTP.
 * @param {Express.Response} res - La respuesta HTTP.
 *
 * @returns {void}
 */
function registerUserHTTP(req, res) {
    const { username, password, score = 0 } = req.body;

    if (!username || !password) {
        return res.status(400).json(ErrorCodes.MISSING_FIELDS);
    }

    const existingUser = findUser(username);

    if (existingUser) {
        return res.status(409).json(ErrorCodes.USER_ALREADY_EXISTS);
    }

    const hashedPassword = hashPassword(password);
    addUser({ username, password: hashedPassword, score });

    res.status(201).json({ message: "Usuario registrado correctamente" });
}

//Registro desde WebSocket

/**
 * Registra un nuevo usuario en la base de datos desde un mensaje WebSocket.
 *
 * @param {WebSocket} ws - El objeto WebSocket del cliente.
 * @param {Object} payload - El objeto con los datos del usuario.
 * @param {string} payload.username - El nombre de usuario.
 * @param {string} payload.password - La contraseña.
 * @param {number} [payload.score=0] - La puntuacion inicial.
 *
 * @returns {void}
 */
function handleRegister(ws, payload) {
    const { username, password, score = 0 } = payload;

    const existingUser = findUser(username);

    if (existingUser) {
        sendError(ws, ErrorCodes.USER_ALREADY_EXISTS);
        return;
    }

    const hashedPassword = hashPassword(password);
    addUser({ username, password: hashedPassword, score });

    sendResponse(ws, 'register', { success: true, message: 'Usuario registrado correctamente' });
}




module.exports = { registerUserHTTP };
