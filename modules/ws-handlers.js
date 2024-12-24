const { handleLogin } = require('./login');
const { handleRegister } = require('./register');
const { sendError } = require('../utils/responder');
const { ErrorCodes } = require('./error-codes');

function handleMessage(ws, message) {
    try {
        const data = JSON.parse(message);

        console.log(`Evento recibido: ${data.action}`);
        switch (data.action) {
            case 'login':
                handleLogin(ws, data.payload);
                break;
            case 'register':
                handleRegister(ws, data.payload);
                break;
            case 'join':
                console.log(`Cliente ${ws.id} quiere unirse a la sala ${data.roomId}`);
                break;
            case 'leave':
                console.log(`Cliente ${ws.id} quiere salir de la sala ${data.roomId}`);
                break;
            default:
                sendError(ws, ErrorCodes.UNKNOWN_EVENT);
                break;
        }
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        sendError(ws, ErrorCodes.INVALID_FORMAT);
    }
}

module.exports = { handleMessage };
