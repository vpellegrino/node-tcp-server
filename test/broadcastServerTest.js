'use strict';

const test = require('tape');

const Client = require('./client');
const BroadcastServer = require('../server/broadcastServer');
const ConnectionHandler = require('../server/connectionHandler');

const messageSent = 'ABCD\r\n';

test.onFinish(() => process.exit(0));

test('Broadcast server with two connected clients, when one client sends a message, then message is received also from the other client', t => {
    t.plan(1);

    const server = setUpServer();

    const firstClient = new Client();
    const secondClient = new Client();

    Promise.all([firstClient.init(), secondClient.init()])
        .then(() => {
            firstClient.listenOnSocket((data) => {
                t.equals(
                    data.toString(),
                    messageSent,
                    'first client it should receive broadcasted message'
                );
                server.close();
            });
            secondClient.sendMessage(messageSent).then(() => {
                t.fail('sender should not receive broadcasted message back');
            });
        });
});

test('Broadcast server with three connected clients, when one client sends a message, then message is received also from the other ones', t => {
    t.plan(2);

    const server = setUpServer();

    const firstClient = new Client();
    const secondClient = new Client();
    const thirdClient = new Client();

    Promise.all([firstClient.init(), secondClient.init(), thirdClient.init()])
        .then(() => {
            firstClient.listenOnSocket((data) => {
                t.equals(
                    data.toString(),
                    messageSent,
                    'first client it should receive broadcasted message'
                );
            });
            secondClient.listenOnSocket((data) => {
                t.equals(
                    data.toString(),
                    messageSent,
                    'second client it should receive broadcasted message'
                );
                server.close();
            });
            thirdClient.sendMessage(messageSent).then(() => {
                t.fail('sender should not receive broadcasted message back');
            });
        });
});

test('Broadcast server with three connected clients, when one client leaves the chat, then only two clients are connected', t => {
    t.plan(1);

    const connectionHandler = new ConnectionHandler();
    const server = setUpServer(connectionHandler);

    const firstClient = new Client();
    const secondClient = new Client();
    const thirdClient = new Client();

    Promise.all([firstClient.init(), secondClient.init(), thirdClient.init(), firstClient.close()])
        .then(() => {
            t.equals(
                connectionHandler.numberOfConnectedClients(),
                2,
                'only two clients should be connected'
            );
            server.close();
        });

});

function setUpServer(customConnectionHandler = new ConnectionHandler()) {
    const server = new BroadcastServer(customConnectionHandler, true);
    server.startOnPort(10000);
    return server;
}
