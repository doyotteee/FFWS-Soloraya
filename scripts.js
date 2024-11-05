let waterLevel = 0;
let waterLevelData = [];
let labels = [];
let autoUpdateInterval = null;
let chart = null;

function updateData(data) {
  waterLevelData = data.map((item) => parseFloat(item.water_level));
  labels = data.map((item, index) => index + 1);

  waterLevel = waterLevelData[waterLevelData.length - 1] || 0;
  
  updateStatus();
  updateChart();
}

function resetData() {
  waterLevel = 0;
  waterLevelData = [];
  labels = [];
  updateStatus();
  updateChart();
}

function toggleAutoUpdate() {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    autoUpdateInterval = null;
  } else {
    autoUpdateInterval = setInterval(fetchData, 5000);
  }
}

function updateStatus() {
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

function fetchData() {
  fetch('get_data.php')
    .then(response => response.json())
    .then(data => {
      updateData(data);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  autoUpdateInterval = setInterval(fetchData, 5000);
  updateStatus();
  updateChart();
});