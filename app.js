let data = [];
const maxDataPoints = 20;

const EARLY_WARNING_THRESHOLD = 5;
const SAFE_THRESHOLD = 10;
const WARNING_THRESHOLD = 15;

const ctx = document.getElementById('waterLevelChart').getContext('2d');
const waterLevelChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Level Air (m)',
      data: [],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true
      },
      y: {
        display: true,
        suggestedMin: 0,
        suggestedMax: 20
      }
    }
  }
});

function updateChart(newData) {
  const labels = waterLevelChart.data.labels;
  if (labels.length >= maxDataPoints) {
    labels.shift();
    waterLevelChart.data.datasets[0].data.shift();
  }

  const currentTime = new Date().toLocaleTimeString();
  labels.push(currentTime);
  waterLevelChart.data.datasets[0].data.push(newData);

  waterLevelChart.update();
}

function updateStatus(level) {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const alertBanner = document.getElementById('alertBanner');
  let status = 'safe';
  let statusMessage = 'Status: Normal';

  if (level > WARNING_THRESHOLD) {
    status = 'danger';
    statusMessage = 'Status: Bahaya';
    alertBanner.className = 'alert-banner show danger';
    alertBanner.textContent = '⚠️ PERINGATAN BAHAYA! ⚠️';
  } else if (level > SAFE_THRESHOLD) {
    status = 'warning';
    statusMessage = 'Status: Waspada';
    alertBanner.className = 'alert-banner show warning';
    alertBanner.textContent = '⚠️ PERINGATAN WASPADA! ⚠️';
  } else if (level >= EARLY_WARNING_THRESHOLD) {
    status = 'early-warning';
    statusMessage = 'Status: Peringatan Dini';
    alertBanner.className = 'alert-banner show early-warning';
    alertBanner.textContent = '⚠️ PERINGATAN DINI! ⚠️';
  } else {
    alertBanner.className = 'alert-banner';
  }

  statusIndicator.className = `status-indicator ${status}`;
  statusText.textContent = statusMessage;
  document.querySelector('.current-level').textContent = `${level.toFixed(1)} m`;
}

function updateInfo() {
  const levels = waterLevelChart.data.datasets[0].data;
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);
  const avgLevel = levels.reduce((acc, level) => acc + level, 0) / levels.length;

  document.getElementById('minLevel').textContent = `${minLevel.toFixed(1)} m`;
  document.getElementById('maxLevel').textContent = `${maxLevel.toFixed(1)} m`;
  document.getElementById('avgLevel').textContent = `${avgLevel.toFixed(1)} m`;
}

function simulateData() {
  const newData = Math.random() * 20;
  updateChart(newData);
  updateStatus(newData);
  updateInfo();
}

function resetData() {
  data = [];
  waterLevelChart.data.labels = [];
  waterLevelChart.data.datasets[0].data = [];
  waterLevelChart.update();

  updateStatus(0);
  updateInfo();
}
