'use strict';

const EventEmitter = require('events');
const net = require('net');
const uuid = require('uuid/v4');

const port = process.env.PORT || 3000;
const server = net.createServer();
const events = new EventEmitter();

const socketPool = {};

let User = function(socket) {
  this.id = uuid();
  this.nickname = `User-${this.id}`;
  this.socket = socket;
}

server.on('connection', socket => {
  let user = new User(socket);
  socketPool[user.id] = user;
  socket.on('data', buffer => {
    dispatchAction(user.id, buffer);
  });
});

let parse = (buffer) => {
  let text = buffer.toString().trim();

  if(!text.startsWith('@')) { return null; }

  let [command, payload] = text.split(/\s+(.*)/);
  let [target, message] = payload.split(/\s+(.*)/);

  return {command, payload, target, message};
};

let dispatchAction = (userId, buffer) => {
  let entry = parse(buffer);
  entry && events.emit(entry.command, entry, userId);
};

events.on('@all', (data, userId) => {
  for(let connection in socketPool) {
    let user = socketPool[connection];
    console.log(data);
    user.socket.write(`<${socketPool[userId].nickname}>: ${data.payload}\n`);
  }
});

events.on('@nick', (data, userId) => {
  socketPool[userId].nickname = data.target;
});

events.on('@dm', (data, userId) => {
  let person = data.target;
  // TODO: finish DM Command

});

// TODO: Finish list command to display socketPool
// TODO: Finish Quit command

server.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});
