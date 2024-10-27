let waterLevel = 0;
let waterLevelData = [];
let autoUpdateInterval = null;
let chart = null;

function simulateData() {
  const change = (Math.random() - 0.5) * 2; 
  waterLevel = Math.max(0, Math.min(20, waterLevel + change));
  
  updateStatus();
  waterLevelData.push(waterLevel);
  
  if (waterLevelData.length > 20) {
    waterLevelData.shift();
  }
  
  updateChart();
}

function resetData() {
  waterLevel = 0;
  waterLevelData = [];
  updateStatus();
  updateChart();
}

function updateStatus() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const alertBanner = document.getElementById('alertBanner');
  const currentLevel = document.querySelector('.current-level');
  const minLevel = document.getElementById('minLevel');
  const maxLevel = document.getElementById('maxLevel');
  const avgLevel = document.getElementById('avgLevel');
  
  currentLevel.textContent = `${waterLevel.toFixed(1)} m`;
  
  const min = Math.min(...waterLevelData).toFixed(1);
  const max = Math.max(...waterLevelData).toFixed(1);
  const avg = (waterLevelData.reduce((acc, val) => acc + val, 0) / waterLevelData.length).toFixed(1);
  
  minLevel.textContent = `${min} m`;
  maxLevel.textContent = `${max} m`;
  avgLevel.textContent = `${avg} m`;
  
  if (waterLevel >= 15) {
    statusIndicator.className = 'status-indicator danger';
    statusText.textContent = 'Status: Bahaya';
    alertBanner.style.display = 'block';
  } else if (waterLevel >= 10) {
    statusIndicator.className = 'status-indicator warning';
    statusText.textContent = 'Status: Waspada';
    alertBanner.style.display = 'none';
  } else if (waterLevel >= 5) {
    statusIndicator.className = 'status-indicator early-warning';
    statusText.textContent = 'Status: Peringatan Dini';
    alertBanner.style.display = 'none';
  } else {
    statusIndicator.className = 'status-indicator safe';
    statusText.textContent = 'Status: Normal';
    alertBanner.style.display = 'none';
  }
  
  const filledHeight = `${(waterLevel / 20) * 100}%`;
  statusIndicator.style.setProperty('--filled-height', filledHeight);
}

function toggleAutoUpdate() {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    autoUpdateInterval = null;
  } else {
    autoUpdateInterval = setInterval(simulateData, 2000);
  }
}

function updateChart() {
  if (!chart) {
    const ctx = document.getElementById('waterLevelChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: waterLevelData.length }, (_, i) => i + 1),
        datasets: [{
          label: 'Level Air (m)',
          data: waterLevelData,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderWidth: 2,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Waktu',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Level Air (m)',
            },
            suggestedMin: 0,
            suggestedMax: 20,
          },
        },
      },
    });
  } else {
    chart.data.labels = Array.from({ length: waterLevelData.length }, (_, i) => i + 1);
    chart.data.datasets[0].data = waterLevelData;
    chart.update();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateStatus();
  updateChart();
});
