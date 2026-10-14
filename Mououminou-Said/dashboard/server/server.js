const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Données simulées
const countries = ['France', 'USA', 'Japon', 'Brésil', 'Allemagne', 'Canada', 'Inde', 'Espagne'];
const events = [
  'a passé une commande',
  'a créé un compte',
  'a ajouté un produit au panier',
  'a laissé un avis 5★',
  's\'est abonné à la newsletter',
  'a téléchargé le rapport'
];
const users = ['Alice', 'Karim', 'Yuki', 'Lucas', 'Sofia', 'Emma', 'Noah', 'Liam'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// État global du dashboard
let state = {
  visitors: 342,
  revenue: 12450.75,
  orders: 128,
  conversion: 3.42,
  countries: countries.map(c => ({ name: c, value: Math.floor(Math.random() * 100) + 10 }))
};

io.on('connection', (socket) => {
  console.log(`✅ Client connecté : ${socket.id}`);

  // Envoyer l'état initial
  socket.emit('init', state);

  // Diffuser les métriques toutes les 2 secondes
  const metricsInterval = setInterval(() => {
    // Variation aléatoire
    state.visitors = Math.max(50, state.visitors + Math.floor(Math.random() * 60) - 25);
    state.revenue += Math.random() * 200;
    state.orders += Math.random() > 0.6 ? 1 : 0;
    state.conversion = +(2 + Math.random() * 3).toFixed(2);

    socket.emit('metrics', {
      visitors: state.visitors,
      revenue: +state.revenue.toFixed(2),
      orders: state.orders,
      conversion: state.conversion,
      timestamp: Date.now()
    });
  }, 2000);

  // Diffuser les événements live toutes les 3-5 secondes
  const eventsInterval = setInterval(() => {
    const event = {
      id: Date.now(),
      user: randomItem(users),
      action: randomItem(events),
      country: randomItem(countries),
      timestamp: Date.now()
    };
    socket.emit('event', event);

    // Toast pour les commandes
    if (event.action.includes('commande')) {
      socket.emit('toast', {
        type: 'success',
        title: 'Nouvelle vente 🎉',
        message: `${event.user} (${event.country}) a passé une commande`
      });
    }
  }, 3500 + Math.random() * 2000);

  // Mise à jour des pays toutes les 8 secondes
  const countriesInterval = setInterval(() => {
    state.countries = countries.map(c => ({
      name: c,
      value: Math.floor(Math.random() * 100) + 10
    })).sort((a, b) => b.value - a.value);
    socket.emit('countries', state.countries);
  }, 8000);

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté : ${socket.id}`);
    clearInterval(metricsInterval);
    clearInterval(eventsInterval);
    clearInterval(countriesInterval);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});