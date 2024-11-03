const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let waterLevelHistory = [];
let currentWaterLevel = 0.0;

io.on('connection', (socket) => {
  socket.emit('waterLevelData', { currentLevel: currentWaterLevel, history: waterLevelHistory });

  socket.on('requestData', () => {
    socket.emit('waterLevelData', { currentLevel: currentWaterLevel, history: waterLevelHistory });
  });

  socket.on('resetData', () => {
    waterLevelHistory = [];
    currentWaterLevel = 0.0;
    io.emit('waterLevelData', { currentLevel: currentWaterLevel, history: waterLevelHistory });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Simulasi perubahan level air (Anda bisa menghubungkan ini dengan sensor nyata)
setInterval(() => {
  const randomChange = (Math.random() * 2 - 1).toFixed(2);
  currentWaterLevel = Math.max(0, (parseFloat(currentWaterLevel) + parseFloat(randomChange)).toFixed(2));
  waterLevelHistory.push({ time: new Date().toLocaleTimeString(), level: currentWaterLevel });

  if (waterLevelHistory.length > 20) {
    waterLevelHistory.shift();
  }

  io.emit('waterLevelData', { currentLevel: currentWaterLevel, history: waterLevelHistory });
}, 5000);
