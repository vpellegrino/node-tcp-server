'use strict';

const BroadcastServer = require('./server/broadcastServer');

const server = new BroadcastServer();

server.startOnPort(10000);
