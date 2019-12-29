'use strict';

const net = require('net');

const ConnectionHandler = require('./ConnectionHandler');

module.exports = class BroadcastServer {

    silentMode;
    server = {};

    constructor(connectionHandler = new ConnectionHandler(), silentMode = false) {
        this.server = net.createServer();
        this.server.on('close', () => console.log(`Server disconnected`));
        this.server.on('error', error => console.log(`Error: ${error}`));
        this.server.on('connection', connectionHandler.listenForConnections(silentMode));
        this.silentMode = silentMode;
    }

    startOnPort(serverPort = 10000) {
        this.server.listen(serverPort, () => {
            if (!this.silentMode) {
                return console.log(`Broadcast chat server has been started on port ${serverPort}!`);
            }
        });
    }

    close() {
        this.server.close();
    }

};
