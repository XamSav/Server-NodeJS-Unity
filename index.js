//HTTP
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
//WebSocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
//Modulos
const { registerUserHTTP } = require('./modules/register');
const {getLeaderboardHTTP} = require('./modules/leaderboard');
const { handleMessage } = require('./modules/ws-handlers');
const { setPlayers } = require('./modules/user-data');
const { loginUser } = require('./modules/login');
app.use(bodyParser.json());
// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));
// GETTERS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

//--- APIS

app.get('/api/leaderboard', getLeaderboardHTTP); // Tabla de clasificaciones
// POSTS
app.post('/api/register', registerUserHTTP); // Registro de usuarios
app.post('/api/login', loginUser);

setPlayers();

const HTTP_PORT = 80;
app.listen(HTTP_PORT, () => {
    console.log(`Servidor HTTP en el puerto ${HTTP_PORT}`);
});

// WebSocket
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    ws.on('message', (message) => {
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket en el puerto 8080');
