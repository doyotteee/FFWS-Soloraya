const socket = io();
const alertBanner = document.getElementById('alertBanner');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const minLevel = document.getElementById('minLevel');
const maxLevel = document.getElementById('maxLevel');
const ctx = document.getElementById('waterLevelChart').getContext('2d');

let waterLevelData = [];
let labels = [];
let autoUpdate = false;

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Level Air (m)',
      data: waterLevelData,
      backgroundColor: 'rgba(0, 123, 255, 0.5)',
      borderColor: 'rgba(0, 123, 255, 1)',
      borderWidth: 1,
      fill: true,
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

socket.on('sensorData', (data) => {
  updateWaterLevel(data);
});

function updateWaterLevel(data) {
  const currentLevel = parseFloat(data.level);
  waterLevelData.push(currentLevel);
  labels.push(new Date().toLocaleTimeString());

  chart.update();

  const max = Math.max(...waterLevelData);
  const min = Math.min(...waterLevelData);

  maxLevel.textContent = `${max.toFixed(2)} m`;
  minLevel.textContent = `${min.toFixed(2)} m`;

  statusIndicator.querySelector('.current-level').textContent = `${currentLevel.toFixed(2)} m`;

  if (currentLevel >= 15) {
    statusIndicator.className = 'status-indicator danger';
    statusText.textContent = 'Status: Bahaya';
    alertBanner.style.display = 'block';
  } else if (currentLevel >= 10) {
    statusIndicator.className = 'status-indicator warning';
    statusText.textContent = 'Status: Waspada';
    alertBanner.style.display = 'none';
  } else if (currentLevel >= 5) {
    statusIndicator.className = 'status-indicator early-warning';
    statusText.textContent = 'Status: Peringatan Dini';
    alertBanner.style.display = 'none';
  } else {
    statusIndicator.className = 'status-indicator safe';
    statusText.textContent = 'Status: Normal';
    alertBanner.style.display = 'none';
  }
}

function fetchData() {
  const level = Math.random() * 20;
  updateWaterLevel({ level });
}

function resetData() {
  waterLevelData = [];
  labels = [];
  chart.update();
  statusIndicator.className = 'status-indicator safe';
  statusText.textContent = 'Status: Normal';
  minLevel.textContent = '0.0 m';
  maxLevel.textContent = '0.0 m';
  alertBanner.style.display = 'none';
}

function toggleAutoUpdate() {
  autoUpdate = !autoUpdate;
  if (autoUpdate) {
    autoUpdateData();
  }
}

function autoUpdateData() {
  if (autoUpdate) {
    fetchData();
    setTimeout(autoUpdateData, 2000);
  }
}
