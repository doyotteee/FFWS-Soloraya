const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const os = require('os');
const port = 3000;

// Fungsi untuk mendapatkan alamat IP lokal
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

// Konfigurasi untuk melayani file statis
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Perangkat terhubung');

  socket.on('sensorData', (data) => {
    console.log('Data sensor diterima:', data);
    io.emit('sensorData', data);
  });

  socket.on('disconnect', () => {
    console.log('Perangkat terputus');
  });
});

http.listen(port, () => {
  const localIP = getLocalIP();
  console.log(`Server berjalan di http://${localIP}:${port}`);
});
