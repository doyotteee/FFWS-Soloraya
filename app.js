let waterLevel = 0;
let waterLevelData = [];

function simulateData() {
  waterLevel = Math.random() * 20; // Simulate water level between 0 and 20 meters
  updateStatus();
  waterLevelData.push(waterLevel);
  updateChart();
  updateStats();
}

function resetData() {
  waterLevel = 0;
  waterLevelData = [];
  updateStatus();
  updateChart();
  updateStats();
}

function updateStatus() {
  const statusIndicator = document.getElementById("statusIndicator");
  const statusText = document.getElementById("statusText");
  const currentLevel = document.querySelector(".current-level");
  currentLevel.textContent = `${waterLevel.toFixed(1)} m`;

  if (waterLevel < 10) {
    statusIndicator.className = "status-indicator safe";
    statusText.textContent = "Status: Normal";
  } else if (waterLevel < 15) {
    statusIndicator.className = "status-indicator warning";
    statusText.textContent = "Status: Waspada";
  } else {
    statusIndicator.className = "status-indicator danger";
    statusText.textContent = "Status: Bahaya";
  }
}

function updateChart() {
  const ctx = document.getElementById("waterLevelChart").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: waterLevelData.map((_, i) => i + 1),
      datasets: [{
        label: 'Water Level (m)',
        data: waterLevelData,
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 20
        }
      }
    }
  });
}

function updateStats() {
  const minLevel = document.getElementById("minLevel");
  const maxLevel = document.getElementById("maxLevel");
  const avgLevel = document.getElementById("avgLevel");

  if (waterLevelData.length > 0) {
    minLevel.textContent = `${Math.min(...waterLevelData).toFixed(1)} m`;
    maxLevel.textContent = `${Math.max(...waterLevelData).toFixed(1)} m`;
    avgLevel.textContent = `${(waterLevelData.reduce((a, b) => a + b, 0) / waterLevelData.length).toFixed(1)} m`;
  } else {
    minLevel.textContent = "0.0 m";
    maxLevel.textContent = "0.0 m";
    avgLevel.textContent = "0.0 m";
  }
}
