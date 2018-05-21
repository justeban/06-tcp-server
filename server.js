'use strict';

const EventEmitter = require('events');
const net = require('net');
const uuid = require('uuid/v4');

const port = process.env.PORT || 3000;
const server = net.createServer();
const events = new EventEmitter();

const socketPool = {};

server.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});
