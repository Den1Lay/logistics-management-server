const io = require('socket.io-client');
const socketClient = io.connect('http://localhost:4040'); //add port

setTimeout(() => {
  process.exit(0);
}, 100)
socketClient.on('connect', () => {
  socketClient.emit('npmStop');
  setTimeout(() => {
    process.exit(0);
  },1000)
})
