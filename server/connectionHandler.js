'use strict';

const NEW_LINE = `\r\n`;

module.exports = class ConnectionHandler {
    clients = {};

    numberOfConnectedClients() {
        return Object.keys(this.clients).length;
    }

    listenForConnections(silentMode = false) {
        return connection => {
            this.clients[getClientId(connection)] = connection;
            connection.setEncoding('utf-8');

            if (!silentMode) {
                connection.write(`Welcome to the Broadcast Chat Server!${NEW_LINE}`);
            }

            connection.on('data', textListener(this.clients, connection));
            connection.on('close', () => delete this.clients[getClientId(connection)]);
            connection.on('error', error => connection.write(`Error : ${error}`));
        };
    }
};

function textListener(clients, currentConnection) {
    let messageBuffer = [];
    return typedCharacters => {
        messageBuffer.push(typedCharacters);

        if (typedCharacters === NEW_LINE || typedCharacters.endsWith(NEW_LINE)) {
            const typedLine = messageBuffer.join('').replace(NEW_LINE, '');

            broadcastMsg(`${typedLine}${NEW_LINE}`, clients, currentConnection);
            messageBuffer = [];
        }
    };
}

function getClientId(connection) {
    return `${connection.remoteAddress}:${connection.remotePort}`;
}

function broadcastMsg(msg, clients, currentConnection) {
    for (let client in clients) {
        if (clients.hasOwnProperty(client) && clients[client] !== currentConnection) {
            clients[client].write(msg);
        }
    }
}
