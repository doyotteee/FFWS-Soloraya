let waterLevelData = [];
let labels = [];
let chart = null;
let socket = null;

function updateData(data) {
  waterLevelData.push(parseFloat(data[0].water_level));
  labels.push(new Date(data[0].timestamp).toLocaleTimeString());

  if (waterLevelData.length > 10) {
    waterLevelData.shift();
    labels.shift();
  }

  updateStatus();
  updateChart();
}

function updateStatus() {
  const waterLevel = waterLevelData[waterLevelData.length - 1] || 0;
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const currentLevelElem = document.querySelector('.current-level');
  const minLevelElem = document.getElementById('minLevel');
  const maxLevelElem = document.getElementById('maxLevel');

  currentLevelElem.textContent = `${waterLevel.toFixed(1)} m`;

  if (waterLevel < 5) {
    statusIndicator.className = 'status-indicator safe';
    statusText.textContent = 'Status: Normal';
  } else if (waterLevel >= 5 && waterLevel < 10) {
    statusIndicator.className = 'status-indicator warning';
    statusText.textContent = 'Status: Waspada';
  } else if (waterLevel >= 10 && waterLevel < 15) {
    statusIndicator.className = 'status-indicator danger';
    statusText.textContent = 'Status: Bahaya';
  } else {
    statusIndicator.className = 'status-indicator danger';
    statusText.textContent = 'Status: Kritis';
  }

  if (waterLevelData.length > 0) {
    minLevelElem.textContent = `${Math.min(...waterLevelData).toFixed(1)} m`;
    maxLevelElem.textContent = `${Math.max(...waterLevelData).toFixed(1)} m`;
  } else {
    minLevelElem.textContent = '0.0 m';
    maxLevelElem.textContent = '0.0 m';
  }

  const alertBanner = document.getElementById('alertBanner');
  alertBanner.style.display = waterLevel >= 5 ? 'block' : 'none';
}

function updateChart() {
  const ctx = document.getElementById('waterLevelChart').getContext('2d');

  if (!chart) {
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tinggi Permukaan Air',
          data: waterLevelData,
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 20
          },
          x: {
            title: {
              display: true,
              text: 'Waktu'
            }
          }
        }
      }
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = waterLevelData;
    chart.update();
  }
}

function setupWebSocket() {
  socket = new WebSocket('ws://localhost:8080');

  socket.onopen = () => {
    document.getElementById('connectionStatus').textContent = 'Terhubung';
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateData([data]);
  };

  socket.onclose = () => {
    document.getElementById('connectionStatus').textContent = 'Terputus';
    setTimeout(setupWebSocket, 1000);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  setupWebSocket();
  updateStatus();
  updateChart();
});