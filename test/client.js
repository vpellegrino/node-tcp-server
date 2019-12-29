'use strict';

const net = require('net');

module.exports = class Client {
    constructor(port = 10000, address = 'localhost') {
        this.socket = new net.Socket();
        this.address = address;
        this.port = port;
    }

    init() {
        return new Promise(resolve => {
            this.socket.connect(this.port, this.address, () => resolve());
        });
    }

    close() {
        return new Promise(resolve => {
            this.socket.end(() => resolve());
        });
    }

    listenOnSocket(listener) {
        this.socket.on('data', listener);
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {

            this.socket.write(message);

            this.socket.on('data', (data) => {
                resolve(data);
            });

            this.socket.on('error', (err) => {
                reject(err);
            });

        });
    }
};
