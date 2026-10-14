// ============ GRAPHIQUE TEMPS RÉEL ============
const realtimeCtx = document.getElementById('realtimeChart').getContext('2d');

const gradient = realtimeCtx.createLinearGradient(0, 0, 0, 250);
gradient.addColorStop(0, 'rgba(13,110,253,0.35)');
gradient.addColorStop(1, 'rgba(13,110,253,0)');

const realtimeChart = new Chart(realtimeCtx, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Visiteurs',
      data: [],
      borderColor: '#0d6efd',
      backgroundColor: gradient,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (items) => new Date(items[0].parsed.x).toLocaleTimeString()
        }
      }
    },
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          duration: 30000,   // Fenêtre de 30 secondes
          refresh: 1000,     // Rafraîchissement à 1s
          delay: 1000,
          onRefresh: (chart) => {
            chart.data.datasets[0].data.push({
              x: Date.now(),
              y: window.__currentVisitors ?? 0
            });
          }
        },
        grid: { display: false },
        ticks: {
          color: 'rgba(150,150,150,0.7)',
          maxRotation: 0,
          callback: function (val) {
            return new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(150,150,150,0.1)' },
        ticks: { color: 'rgba(150,150,150,0.7)' }
      }
    }
  }
});

// ============ GRAPHIQUE SOURCES DE TRAFIC ============
const trafficCtx = document.getElementById('trafficChart').getContext('2d');

const trafficChart = new Chart(trafficCtx, {
  type: 'doughnut',
  data: {
    labels: ['Direct', 'Recherche', 'Social', 'Email'],
    datasets: [{
      data: [42, 28, 20, 10],
      backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 12,
          color: 'rgba(180,180,180,0.9)',
          font: { size: 12 }
        }
      }
    }
  }
});

// Export pour main.js
window.realtimeChart = realtimeChart;
window.trafficChart = trafficChart;