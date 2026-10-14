// Initialisation Socket.IO
const socket = io();

// Expose globalement (utilisé par main.js et charts.js)
window.socket = socket;

socket.on('connect', () => {
  console.log('🟢 Connecté au serveur Socket.IO :', socket.id);
});

socket.on('disconnect', () => {
  console.warn('🔴 Déconnecté du serveur');
});