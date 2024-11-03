const socket = io();

let waterLevelChart = null;
let autoUpdate = false;
let updateInterval;

const waterLevels = [];
const timestamps = [];

// Fungsi untuk memperbarui data grafik
function updateChart(data) {
  const { level, timestamp } = data;
  
  waterLevels.push(level);
  timestamps.push(new Date(timestamp).toLocaleTimeString());
  
  if (waterLevels.length > 20) {
    waterLevels.shift();
    timestamps.shift();
  }
  
  waterLevelChart.update();
}

// Inisialisasi grafik
document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('waterLevelChart').getContext('2d');
  waterLevelChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Level Air',
        data: waterLevels,
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: { display: true, title: { display: true, text: 'Waktu' }},
        y: { display: true, title: { display: true, text: 'Level Air (m)' }}
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  fetchData();
});

socket.on('waterLevelUpdate', (data) => {
  updateChart(data);
  updateStatus(data.level);
  updateInfo(data.level);
  updateAlert(data.level);
});

// Fungsi untuk memperbarui indikator status
function updateStatus(level) {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  statusIndicator.className = 'status-indicator';

  if (level <= 10) {
    statusIndicator.classList.add('safe');
    statusText.textContent = 'Status: Normal';
  } else if (level > 10 && level <= 15) {
    statusIndicator.classList.add('warning');
    statusText.textContent = 'Status: Waspada';
  } else if (level > 15) {
    statusIndicator.classList.add('danger');
    statusText.textContent = 'Status: Bahaya';
  }
}

// Fungsi untuk memperbarui informasi level air
function updateInfo(level) {
  document.getElementById('minLevel').textContent = Math.min(...waterLevels).toFixed(1) + ' m';
  document.getElementById('maxLevel').textContent = Math.max(...waterLevels).toFixed(1) + ' m';
}

// Fungsi untuk memperbarui banner peringatan
function updateAlert(level) {
  const alertBanner = document.getElementById('alertBanner');
  alertBanner.style.display = (level > 15) ? 'block' : 'none';
}

// Fungsi untuk mengambil data dari server
function fetchData() {
  socket.emit('requestData');
}

// Fungsi untuk mereset data
function resetData() {
  waterLevels.length = 0;
  timestamps.length = 0;
  waterLevelChart.update();
}

// Fungsi untuk mengaktifkan atau menonaktifkan pembaruan otomatis
function toggleAutoUpdate() {
  autoUpdate = !autoUpdate;
  
  if (autoUpdate) {
    updateInterval = setInterval(fetchData, 5000);
  } else {
    clearInterval(updateInterval);
  }
}
