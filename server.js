const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let waterLevel = 0;

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rute untuk halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simulasi perubahan level air setiap detik
setInterval(() => {
  waterLevel = Math.random() * 20;
  const data = {
    level: waterLevel,
    timestamp: new Date().toISOString()
  };
  io.emit('waterLevelUpdate', data);
}, 1000);

// Koneksi socket.io
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('requestData', () => {
    const data = {
      level: waterLevel,
      timestamp: new Date().toISOString()
    };
    socket.emit('waterLevelUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Jalankan server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
