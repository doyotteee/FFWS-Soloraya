let socket;
let autoUpdate = false;

document.addEventListener('DOMContentLoaded', () => {
    socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = function(event) {
        console.log("WebSocket is open now.");
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        updateData([data]);
    };

    socket.onclose = function(event) {
        console.log("WebSocket is closed now.");
    };

    socket.onerror = function(error) {
        console.log("WebSocket error: " + error);
    };

    updateStatus();
    updateChart();
});

const waterLevelData = [];

function updateData(newData) {
    waterLevelData.push(...newData);
    updateChart();
    updateStatus();
}

function updateStatus() {
    const currentLevel = waterLevelData.length > 0 ? waterLevelData[waterLevelData.length - 1].level : 0;
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const minLevel = document.getElementById('minLevel');
    const maxLevel = document.getElementById('maxLevel');
    
    if (currentLevel < 5) {
        statusIndicator.className = 'status-indicator safe';
        statusText.textContent = 'Status: Normal';
    } else if (currentLevel < 10) {
        statusIndicator.className = 'status-indicator warning';
        statusText.textContent = 'Status: Waspada';
    } else {
        statusIndicator.className = 'status-indicator danger';
        statusText.textContent = 'Status: Bahaya';
    }

    statusIndicator.querySelector('.current-level').textContent = `${currentLevel} m`;

    if (waterLevelData.length > 0) {
        minLevel.textContent = `${Math.min(...waterLevelData.map(d => d.level))} m`;
        maxLevel.textContent = `${Math.max(...waterLevelData.map(d => d.level))} m`;
    }
}

function updateChart() {
    const ctx = document.getElementById('waterLevelChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: waterLevelData.map(d => d.timestamp),
            datasets: [{
                label: 'Water Level (m)',
                data: waterLevelData.map(d => d.level),
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function fetchData() {
    // Simulate fetching data from the server
    const newData = {
        timestamp: new Date().toISOString(),
        level: (Math.random() * 20).toFixed(2)
    };
    updateData([newData]);
}

function resetData() {
    waterLevelData.length = 0;
    updateChart();
    updateStatus();
}

function toggleAutoUpdate() {
    autoUpdate = !autoUpdate;
    if (autoUpdate) {
        startAutoUpdate();
    } else {
        stopAutoUpdate();
    }
}

function startAutoUpdate() {
    autoUpdateInterval = setInterval(fetchData, 5000);
}

function stopAutoUpdate() {
    clearInterval(autoUpdateInterval);
}
