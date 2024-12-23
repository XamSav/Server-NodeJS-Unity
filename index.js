const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {

    console.log('Nuevo cliente conectado');
    ws.id = `Client_${Math.random().toString(36).substr(2, 9)}`;
    ws.send(JSON.stringify({ eventName: 'PlayerJoin', message: `Bienvenido, ${ws.id}!` }));


    ws.on('message', (message) => {
        console.log(`Mensaje recibido (sin procesar): ${message}`);
        const data = JSON.parse(message);
        console.log(`Mensaje parseado:`, data);
        //------
        switch (data.action) {
            case 'join':
                console.log(`Cliente ${ws.id} quiere unirse a la sala ${data.roomId}`);
                break;
            case 'leave':
                console.log(`Cliente ${ws.id} quiere salir de la sala ${data.roomId}`);
                break;
            case 'message':
                console.log(`Cliente ${ws.id} envía un mensaje en la sala ${data.roomId}: ${data.message}`);
                messageEventHandler(data);  
                break;
            case 'playerLoggin':
                console.log(`Evento playerJoin recibido: ${JSON.stringify(data)}`);
                const playerName = data.payload.name;
                ws.send(JSON.stringify({ event: 'playerJoinAck', message: `Bienvenido, ${playerName}!` }));
                break;
            default:
                console.log(`Acción desconocida: ${data.action}`);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

function messageEventHandler(data) {
    try {
        // Verificar el evento
        switch (data.event) {
            case 'playerJoin':
                console.log(`Evento playerJoin recibido: ${JSON.stringify(data)}`);
                const playerName = data.payload.name;
                ws.send(JSON.stringify({ event: 'playerJoinAck', message: `Bienvenido, ${playerName}!` }));
                break;
            case 'playerMove':
                console.log(`Evento playerMove recibido: ${JSON.stringify(data)}`);
                // Manejar otros eventos
                ws.send(JSON.stringify({ event: 'playerMoveAck', message: 'Movimiento registrado' }));
                break;
            default:
                console.log(`Evento desconocido: ${data.event}`);
                ws.send(JSON.stringify({ event: 'error', message: `Evento desconocido: ${data.event}` }));
                break;
        }
    } catch (err) {
        console.error('Error al procesar el mensaje:', err);
        ws.send(JSON.stringify({ event: 'error', message: 'Formato de mensaje inválido' }));
    }
}

console.log('Servidor WebSocket escuchando en puerto 8080');
