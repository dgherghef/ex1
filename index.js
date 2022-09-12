const express = require('express');
const socketio = require('socket.io');
const http = require('http');
let cors = require('cors');
const PORT = process.env.PORT || 5000;

const { addUser, removeUser, getUsers, getUsersInRoom } = require('./users.js');

const router = require('./router');
const { getuid } = require('process');
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  },
});

app.use(cors());
io.on('connection', (socket) => {
  console.log('Connection');

  socket.on('join', ({ room }, callback) => {
    const { error, user } = addUser({ id: socket.id, room });
    if (error) return callback(error);
    //socket.emit('clients', socket.id);
    // socket.emit('message', { user: socket.id, text: 'Welcome!' });
    // socket.broadcast
    //   .to(user.room)
    //   .emit('message', { user: 'admin', text: 'Player 2 is ready!' });

    socket.join(user.room);
    // console.log(getUsersInRoom(user.room));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    socket.on('card', sendingCards);
    //socket.emit('cardBack', sendingCards);
    function sendingCards(data1, data2) {
      socket.broadcast.emit('card', { player1: data1, player2: data2 });
      console.log('Data1:' + data1);
      console.log('Data2:' + data2);
    }
    // io.to(user.room).emit('card', {
    //   room: user.room,
    //   player1: 'cards',
    // });
    callback();
  });

  //   socket.on('sendCard', (card, callback) => {
  //     const user = getUsers(socket.id);
  //    //const user=addUser()

  //     io.to(user.room).emit('card', { room: user.room,
  //         player1: user.card}
  //     );
  //     callback();
  //   });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log('Running'));
