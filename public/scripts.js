const socket = io();

socket.on('waterLevelData', (data) => {
  updateWaterLevel(data.currentLevel);
  updateChart(data.history);
});

function updateWaterLevel(level) {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const currentLevel = document.querySelector('.current-level');
  const alertBanner = document.getElementById('alertBanner');

  currentLevel.textContent = `${level} m`;

  if (level > 15) {
    statusIndicator.className = 'status-indicator danger';
    statusText.textContent = 'Status: Bahaya';
    alertBanner.style.display = 'block';
  } else if (level > 10) {
    statusIndicator.className = 'status-indicator warning';
    statusText.textContent = 'Status: Waspada';
    alertBanner.style.display = 'none';
  } else if (level > 5) {
    statusIndicator.className = 'status-indicator early-warning';
    statusText.textContent = 'Status: Peringatan Dini';
    alertBanner.style.display = 'none';
  } else {
    statusIndicator.className = 'status-indicator safe';
    statusText.textContent = 'Status: Normal';
    alertBanner.style.display = 'none';
  }
}

function updateChart(history) {
  const ctx = document.getElementById('waterLevelChart').getContext('2d');

  if (window.waterLevelChart) {
    window.waterLevelChart.data.labels = history.map(entry => entry.time);
    window.waterLevelChart.data.datasets[0].data = history.map(entry => entry.level);
    window.waterLevelChart.update();
  } else {
    window.waterLevelChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.map(entry => entry.time),
        datasets: [{
          label: 'Level Air',
          data: history.map(entry => entry.level),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: { display: true, title: { display: true, text: 'Waktu' }},
          y: { display: true, title: { display: true, text: 'Level Air (m)' }}
        }
      }
    });
  }
}

function fetchData() {
  socket.emit('requestData');
}

function resetData() {
  socket.emit('resetData');
}

let autoUpdate = false;
let autoUpdateInterval;

function toggleAutoUpdate() {
  autoUpdate = !autoUpdate;
  if (autoUpdate) {
    autoUpdateInterval = setInterval(fetchData, 5000);
  } else {
    clearInterval(autoUpdateInterval);
  }
}
