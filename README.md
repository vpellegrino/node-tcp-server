# Broadcast Server

This NodeJS application starts a server which listens on TCP, port `10000` for clients.

The aim of such server is to provide a simple chat room, where all text lines typed by a client are sent in broadcast to all others.

## Usage

After starting such "broadcast server" locally, it is possible to connect to it via command line:
```
telnet localhost 10000
```
Obviously, to see the server in action you should start multiple clients, using different shells.

A welcome message will be prompt. You can now start to type a message. As soon as you type `enter`, such message will be sent to all other connected clients.

## Available Scripts

In the project directory, you can install the only dependency, used for testing purpose:

```
npm install
```

The broadcast server can be started locally, running:
```
npm start
```

The test suite can be launched with:
```
npm test
```
Note that, to avoid port conflicts, the test suite should never be launched when the server is running.