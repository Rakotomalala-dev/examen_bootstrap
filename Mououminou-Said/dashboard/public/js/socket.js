const socket = io();
window.socket = socket;
socket.on('connect', () => console.log('🟢 Connecté :', socket.id));
socket.on('disconnect', () => console.warn('🔴 Déconnecté'));