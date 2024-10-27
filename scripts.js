let waterLevel = 0;
let waterLevelData = [];
let labels = [];
let autoUpdateInterval = null;
let chart = null;

function simulateData() {
  // Simulate more realistic water level changes
  const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
  waterLevel = Math.max(0, Math.min(20, waterLevel + change));
  
  updateStatus();
  waterLevelData.push(waterLevel);

  // Get current time
  const now = new Date();
  const timeString = now.toLocaleTimeString();

  labels.push(timeString);
  
  // Remove this line if you want to keep all data points
  // if (waterLevelData.length > 20) {
  //   waterLevelData.shift();
  //   labels.shift();
  // }
  
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
    autoUpdateInterval = setInterval(simulateData, 1000);
  }
}

function updateStatus() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const currentLevelElem = document.querySelector('.current-level');
  const minLevelElem = document.getElementById('minLevel');
  const maxLevelElem = document.getElementById('maxLevel');
  const avgLevelElem = document.getElementById('avgLevel');
  
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
    avgLevelElem.textContent = `${(waterLevelData.reduce((a, b) => a + b, 0) / waterLevelData.length).toFixed(1)} m`;
  } else {
    minLevelElem.textContent = '0.0 m';
    maxLevelElem.textContent = '0.0 m';
    avgLevelElem.textContent = '0.0 m';
  }

  const alertBanner = document.getElementById('alertBanner');
  if (waterLevel >= 5) {
    alertBanner.style.display = 'block';
  } else {
    alertBanner.style.display = 'none';
  }
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
        scales: {
          y: {
            beginAtZero: true,
            max: 20
          },
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'HH:mm:ss',
              displayFormats: {
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH:mm'
              }
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

document.addEventListener('DOMContentLoaded', () => {
  updateStatus();
  updateChart();
});
