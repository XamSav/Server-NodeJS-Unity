class Room {
    /**
     * Crea una nueva habitación con el id proporcionado.
     * @param {string} roomId - El id de la habitación.
     */
    constructor(roomId) {
        this.roomId = roomId;
        this.clients = new Set();
    }
    /**
     * Agrega un cliente a la habitación.
     * @param {Client} client - El cliente que se va a agregar.
     */
    addClient(client) {
        this.clients.add(client);
        console.log(`Cliente añadido a la sala ${this.roomId}. Total: ${this.clients.size}`);
        this.broadcast(`${client.id} se ha unido a la sala ${this.roomId}`, client);
    }

    /**
     * Elimina un cliente de la habitación.
     * @param {Client} client - El cliente que se va a eliminar.
     */
    removeClient(client) {
        if (this.clients.has(client)) {
            this.clients.delete(client);
            console.log(`Cliente eliminado de la sala ${this.roomId}. Total: ${this.clients.size}`);
            this.broadcast(`${client.id} ha salido de la sala ${this.roomId}`);
        }
    }
    /**
     * Envía un mensaje a todos los clientes en la habitación.
     * @param {string} message - El mensaje que se va a enviar.
     * @param {Client} [sender] - El cliente que envía el mensaje. Si se proporciona, se omite al enviar el mensaje.
     */
    broadcast(message, sender = null) {
        this.clients.forEach(client => {
            if (client !== sender) {
                client.send(JSON.stringify({ roomId: this.roomId, message }));
            }
        });
    }

    /**
     * Obtiene el número de clientes actualmente en la habitación.
     * @returns {number} El número de clientes en la habitación.
     */
    getClientCount() {
        return this.clients.size;
    }
}

module.exports = Room;
