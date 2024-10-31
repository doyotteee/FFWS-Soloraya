let waterLevel = 0;
let waterLevelData = [];
let labels = [];
let autoUpdateInterval = null;
let chart = null;

async function fetchData() {
  try {
    const response = await fetch("http://localhost:5000/api/sensor-data");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }
    const data = await response.json();
    
    // Assuming `data` is an array of sensor readings
    updateData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateData(data) {
  waterLevelData = data.map((item) => item.waterLevel);
  labels = data.map((item, index) => index + 1);

  // Update current water level
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
    autoUpdateInterval = setInterval(fetchData, 1000);
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

document.addEventListener('DOMContentLoaded', () => {
  updateStatus();
  updateChart();
});
