// Update status thresholds
const EARLY_WARNING_THRESHOLD = 5;  // New threshold at 5m
const SAFE_THRESHOLD = 10;
const WARNING_THRESHOLD = 15;

// Add new status indicator styles in the head section
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .status-indicator.early-warning {
    border-color: #ff9800;
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.2);
  }

  .alert-banner.early-warning {
    background: linear-gradient(135deg, #ff9800, #f57c00);
    animation: early-warning-pulse 2s infinite;
  }

  @keyframes early-warning-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .early-warning-text {
    color: #ff9800;
    font-weight: 700;
  }
`;
document.head.appendChild(styleSheet);

// Updated updateStatus function
function updateStatus(waterLevel) {
  const indicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const alertBanner = document.getElementById('alertBanner');
  const currentLevel = indicator.querySelector('.current-level');
  
  currentLevel.textContent = `${waterLevel.toFixed(1)} m`;

  // Update alert banner text based on level
  if (waterLevel > WARNING_THRESHOLD) {
    alertBanner.innerHTML = '⚠️ PERINGATAN BAHAYA BANJIR! SEGERA EVAKUASI KE TEMPAT YANG LEBIH TINGGI! ⚠️';
  } else if (waterLevel > SAFE_THRESHOLD) {
    alertBanner.innerHTML = '⚠️ WASPADA! Level Air Sudah Melewati Batas Aman! ⚠️';
  } else if (waterLevel > EARLY_WARNING_THRESHOLD) {
    alertBanner.innerHTML = '⚠️ PERHATIAN! Level Air Mendekati Batas Waspada (5m)! ⚠️';
  }

  // Update status indicator and text
  if (waterLevel > WARNING_THRESHOLD) {
    indicator.className = 'status-indicator danger';
    statusText.innerHTML = '<span class="danger-text">Status: BAHAYA!</span>';
    alertBanner.className = 'alert-banner show';
  } else if (waterLevel > SAFE_THRESHOLD) {
    indicator.className = 'status-indicator warning';
    statusText.innerHTML = '<span style="color: var(--warning-color)">Status: Waspada</span>';
    alertBanner.className = 'alert-banner show';
  } else if (waterLevel > EARLY_WARNING_THRESHOLD) {
    indicator.className = 'status-indicator early-warning';
    statusText.innerHTML = '<span class="early-warning-text">Status: Peringatan Dini</span>';
    alertBanner.className = 'alert-banner early-warning show';
  } else {
    indicator.className = 'status-indicator safe';
    statusText.innerHTML = '<span style="color: var(--safe-color)">Status: Normal</span>';
    alertBanner.className = 'alert-banner';
    alertBanner.classList.remove('show');
  }

  // Update chart color based on water level
  updateChartColor(waterLevel);
}

// Function to update chart color based on water level
function updateChartColor(waterLevel) {
  let borderColor, backgroundColor;
  
  if (waterLevel > WARNING_THRESHOLD) {
    borderColor = '#dc3545';
    backgroundColor = 'rgba(220, 53, 69, 0.1)';
  } else if (waterLevel > SAFE_THRESHOLD) {
    borderColor = '#ffc107';
    backgroundColor = 'rgba(255, 193, 7, 0.1)';
  } else if (waterLevel > EARLY_WARNING_THRESHOLD) {
    borderColor = '#ff9800';
    backgroundColor = 'rgba(255, 152, 0, 0.1)';
  } else {
    borderColor = '#28a745';
    backgroundColor = 'rgba(40, 167, 69, 0.1)';
  }

  waterLevelChart.data.datasets[0].borderColor = borderColor;
  waterLevelChart.data.datasets[0].backgroundColor = backgroundColor;
  waterLevelChart.update();
}

// Update the info card to show the new threshold
const infoGridHTML = `
  <div class="info-item">
    <div class="info-label">Batas Peringatan Dini</div>
    <div class="info-value">5 m</div>
  </div>
  <div class="info-item">
    <div class="info-label">Batas Aman</div>
    <div class="info-value">5 - 10 m</div>
  </div>
  <div class="info-item">
    <div class="info-label">Batas Waspada</div>
    <div class="info-value">10 - 15 m</div>
  </div>
  <div class="info-item">
    <div class="info-label">Batas Bahaya</div>
    <div class="info-value">> 15 m</div>
  </div>
`;

// Update the info grid content
document.querySelector('.card:last-child .info-grid').innerHTML = infoGridHTML;
