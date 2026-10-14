const realtimeCtx = document.getElementById('realtimeChart')?.getContext('2d');
if (realtimeCtx) {
  const gradient = realtimeCtx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, 'rgba(13,110,253,0.35)');
  gradient.addColorStop(1, 'rgba(13,110,253,0)');

  new Chart(realtimeCtx, {
    type: 'line',
    data: { datasets: [{ label: 'Visiteurs', data: [], borderColor: '#0d6efd', backgroundColor: gradient, borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0 }] },
    options: {
      responsive: true, animation: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { type: 'realtime', realtime: { duration: 30000, refresh: 1000, delay: 1000, onRefresh: (chart) => {
          chart.data.datasets[0].data.push({ x: Date.now(), y: window.__currentVisitors ?? 0 });
        }}, grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(150,150,150,0.1)' } }
      }
    }
  });
}

const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
if (trafficCtx) {
  new Chart(trafficCtx, {
    type: 'doughnut',
    data: {
      labels: ['Direct', 'Recherche', 'Social', 'Email'],
      datasets: [{ data: [42, 28, 20, 10], backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'], borderWidth: 0 }]
    },
    options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12 } } } }
  });
}

const analyticsCtx = document.getElementById('analyticsChart')?.getContext('2d');
if (analyticsCtx) {
  new Chart(analyticsCtx, {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{ label: 'Visites', data: [120, 190, 300, 250, 420, 380, 290], backgroundColor: '#0d6efd', borderRadius: 6 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}