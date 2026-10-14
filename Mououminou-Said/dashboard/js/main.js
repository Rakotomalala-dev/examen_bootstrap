// ============ INITIALISATION ============
AOS.init({ duration: 600, once: true });

// ============ THEME TOGGLE ============
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-bs-theme', savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-bs-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-bs-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeBtn.innerHTML = theme === 'dark'
    ? '<i class="bi bi-sun"></i>'
    : '<i class="bi bi-moon-stars"></i>';
}

// ============ FORMATAGE ============
const fmtInt = new Intl.NumberFormat('fr-FR');
const fmtMoney = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ============ COMPTEUR ANIMÉ ============
function animateCounter(el, target, duration = 600) {
  const start = parseInt(el.textContent.replace(/\D/g, '')) || 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (target - start) * progress);
    el.textContent = fmtInt.format(value);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============ MISE À JOUR KPI ============
function updateKPIs(data) {
  // Visiteurs (variable globale pour le chart)
  window.__currentVisitors = data.visitors;
  animateCounter(document.getElementById('kpiVisitors'), data.visitors);

  document.getElementById('kpiRevenue').textContent = fmtMoney.format(data.revenue);
  animateCounter(document.getElementById('kpiOrders'), data.orders);
  document.getElementById('kpiConversion').textContent = data.conversion;

  // Heure de dernière mise à jour
  document.getElementById('lastUpdate').textContent =
    new Date(data.timestamp).toLocaleTimeString('fr-FR');
}

// ============ TRANSACTIONS ============
const clients = ['Alice Martin', 'Karim Ben', 'Yuki Tanaka', 'Lucas Silva', 'Sofia Rossi', 'Emma Dubois', 'Noah Petit', 'Liam Moreau'];
const pays = ['🇫🇷 France', '🇺🇸 USA', '🇯🇵 Japon', '🇧🇷 Brésil', '🇩🇪 Allemagne', '🇨🇦 Canada', '🇮🇳 Inde', '🇪🇸 Espagne'];
const statuts = [
  { label: 'Payée', class: 'success' },
  { label: 'En attente', class: 'warning' },
  { label: 'Échouée', class: 'danger' }
];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function addTransaction() {
  const table = document.getElementById('transactionsTable');
  const statut = randomItem(statuts);
  const montant = (Math.random() * 500 + 20).toFixed(2);
  const now = new Date().toLocaleTimeString('fr-FR');

  const tr = document.createElement('tr');
  tr.style.opacity = '0';
  tr.innerHTML = `
    <td><strong>${randomItem(clients)}</strong></td>
    <td>${randomItem(pays)}</td>
    <td class="fw-semibold">${fmtMoney.format(montant)} €</td>
    <td><span class="badge bg-${statut.class}-subtle text-${statut.class}">${statut.label}</span></td>
    <td class="text-muted small">${now}</td>
  `;
  table.prepend(tr);

  requestAnimationFrame(() => {
    tr.style.transition = 'opacity 0.4s';
    tr.style.opacity = '1';
  });

  // Limiter à 8 lignes
  while (table.children.length > 8) table.removeChild(table.lastChild);
}

// Ajouter une transaction toutes les 4 secondes
setInterval(addTransaction, 4000);
for (let i = 0; i < 6; i++) addTransaction();

// ============ ÉVÉNEMENTS LIVE ============
function addEvent(event) {
  const list = document.getElementById('eventsList');
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex align-items-start gap-3 py-3';
  li.innerHTML = `
    <div class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style="width:38px;height:38px;">
      <i class="bi bi-person"></i>
    </div>
    <div class="flex-grow-1">
      <div class="small">
        <strong>${event.user}</strong> ${event.action}
      </div>
      <small class="text-muted">${event.country} · ${new Date(event.timestamp).toLocaleTimeString('fr-FR')}</small>
    </div>
  `;
  list.prepend(li);
  while (list.children.length > 15) list.removeChild(list.lastChild);
}

// ============ TOP PAYS ============
function renderCountries(countries) {
  const container = document.getElementById('countriesList');
  const max = Math.max(...countries.map(c => c.value));
  container.innerHTML = countries.slice(0, 6).map((c, i) => `
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1 small">
        <span><strong>${i + 1}.</strong> ${c.name}</span>
        <span class="text-muted">${c.value} visiteurs</span>
      </div>
      <div class="progress" style="height: 8px;">
        <div class="progress-bar" role="progressbar"
             style="width: ${(c.value / max) * 100}%"></div>
      </div>
    </div>
  `).join('');
}

// ============ TOASTS ============
function showToast({ type = 'info', title, message }) {
  const container = document.getElementById('toastContainer');
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center border-0';
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <i class="bi bi-check-circle-fill text-${type} fs-5"></i>
        <div>
          <strong class="d-block">${title}</strong>
          <small class="text-muted">${message}</small>
        </div>
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// ============ NOTIFICATIONS NAVBAR ============
let notifCount = 0;
const notifBadge = document.getElementById('notifBadge');
const notifList = document.getElementById('notifList');

function pushNotification(title, message) {
  notifCount++;
  notifBadge.textContent = notifCount;

  // Supprimer "Aucune notification" si présent
  const empty = notifList.querySelector('.text-muted');
  if (empty && empty.textContent.includes('Aucune')) empty.parentElement.remove();

  const li = document.createElement('li');
  li.innerHTML = `
    <a class="dropdown-item py-2" href="#">
      <div class="small fw-semibold">${title}</div>
      <div class="text-muted small">${message}</div>
      <div class="text-muted small">${new Date().toLocaleTimeString('fr-FR')}</div>
    </a>
  `;
  notifList.insertBefore(li, notifList.children[2] || null);

  while (notifList.querySelectorAll('a.dropdown-item').length > 5) {
    notifList.querySelector('a.dropdown-item').parentElement.remove();
  }
}

// Reset badge à l'ouverture
document.querySelector('[data-bs-toggle="dropdown"]').addEventListener('click', () => {
  notifCount = 0;
  notifBadge.textContent = '0';
});

// ============ SOCKET LISTENERS ============
socket.on('init', (state) => {
  updateKPIs({
    visitors: state.visitors,
    revenue: state.revenue,
    orders: state.orders,
    conversion: state.conversion,
    timestamp: Date.now()
  });
  renderCountries(state.countries);
});

socket.on('metrics', (data) => {
  updateKPIs(data);
});

socket.on('event', (event) => {
  addEvent(event);
  pushNotification(
    'Nouvelle activité',
    `${event.user} ${event.action} (${event.country})`
  );
});

socket.on('countries', (countries) => {
  renderCountries(countries);
});

socket.on('toast', (data) => {
  showToast(data);
});