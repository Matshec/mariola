#!/usr/bin/env node
require('dotenv').config();
const app = require('express')();
const WebSocketServer = require('websocket').server;
const http = require('http');
const DBBridge = require('./DatabaseBridge');
const channels = require('./channels');
const jwt = require('jsonwebtoken');
const salt = require('passport-mariola/salt');


const facultyRooms = new Map();

const getFaculty = id => {
    let faculty = facultyRooms.get(id);

    if(!faculty){
        faculty = new Map();
        facultyRooms.set(id, faculty)
    }

    return faculty
};

const setConnection = (facultyId, id, connection) => getFaculty(facultyId).set(id, connection);

const handleConnect = (message, connection) => {
    try {
        message = JSON.parse(message.utf8Data);
        const token = message.token.replace('Bearer ', '');
        const user = jwt.verify(token, salt());
        setConnection(message.facultyId, user.id, connection);
    } catch(err) {
        connection.send(JSON.stringify({message: 'Unauthorized'}))
    }
};


const originIsAllowed = origin => true;

const server = http.createServer(app);

// TODO: security issues
const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});


wsServer.on('request', request => {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        return;
    }

    const connection = request.accept('echo-protocol', request.origin);
    connection.on('message', message => handleConnect(message, connection));

    // TODO: handling closed connections
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


const sendToEachChannel = channel => record => {
    getFaculty(record.facultyId)
        .forEach(conn => conn.send(JSON.stringify({
            channel: channel,
            record: record
        })))
};

const onNewExchangeListener = record => {
    [record.userTo, record.userFrom]
        .forEach(id => getFaculty(record.facultyId)
            .get(id)
            .send(record))
};

new DBBridge(process.env.DATABASE_URL)
    .setListenerOn(channels.INTENTION_CREATED, sendToEachChannel(channels.INTENTION_CREATED))
    .setListenerOn(channels.INTENTION_REMOVED, sendToEachChannel(channels.INTENTION_REMOVED))
    .setListenerOn(channels.EXCHANGE_CREATED, onNewExchangeListener);

module.exports= port => {

    server.listen(port, () => {
        console.log(`Notification server is listening on port ${port}`);
    });

    return server
};