// Quick start script for OpenFront School Edition
// This bypasses webpack and starts a simple HTTP server

const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Game state
let gameState = {
  status: 'waiting',
  playerCount: 0,
  players: []
};

let clients = new Map();

// Serve static files
app.use(express.static('.'));
app.use('/resources', express.static('./resources'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/client/school-simple.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', gameState });
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(ws, message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    handleClientDisconnect(ws);
  });
  
  // Send initial game state
  sendToClient(ws, {
    type: 'gameState',
    data: gameState
  });
});

function handleMessage(ws, message) {
  switch (message.type) {
    case 'joinGame':
      handleJoinGame(ws, message.data);
      break;
    case 'spectateGame':
      handleSpectateGame(ws, message.data);
      break;
    case 'leaveGame':
      handleLeaveGame(ws);
      break;
  }
}

function handleJoinGame(ws, data) {
  const { playerName, playerFlag } = data;
  
  if (!playerName || playerName.length > 20) {
    sendToClient(ws, {
      type: 'error',
      data: { message: 'Invalid player name' }
    });
    return;
  }
  
  // Check if name is taken
  const existingPlayer = Array.from(clients.values()).find(
    client => client.name === playerName && !client.isSpectator
  );
  
  if (existingPlayer) {
    sendToClient(ws, {
      type: 'error',
      data: { message: 'Name already taken' }
    });
    return;
  }
  
  const clientId = Math.random().toString(36).substr(2, 9);
  clients.set(ws, {
    id: clientId,
    name: playerName,
    flag: playerFlag || 'us',
    isSpectator: false
  });
  
  updateGameState();
  broadcastGameState();
  
  console.log(`${playerName} joined the game`);
}

function handleSpectateGame(ws, data) {
  const { playerName, playerFlag } = data;
  const clientId = Math.random().toString(36).substr(2, 9);
  
  clients.set(ws, {
    id: clientId,
    name: playerName || 'Spectator',
    flag: playerFlag || 'us',
    isSpectator: true
  });
  
  updateGameState();
  broadcastGameState();
  
  console.log(`${playerName || 'Spectator'} started spectating`);
}

function handleLeaveGame(ws) {
  const client = clients.get(ws);
  if (client) {
    console.log(`${client.name} left the game`);
    clients.delete(ws);
    updateGameState();
    broadcastGameState();
  }
}

function handleClientDisconnect(ws) {
  handleLeaveGame(ws);
}

function updateGameState() {
  const allClients = Array.from(clients.values());
  const players = allClients.filter(client => !client.isSpectator);
  
  gameState.playerCount = players.length;
  gameState.players = allClients;
  
  // Auto-start game with 2+ players
  if (players.length >= 2 && gameState.status === 'waiting') {
    gameState.status = 'starting';
    setTimeout(() => {
      gameState.status = 'running';
      broadcastGameState();
    }, 3000);
  } else if (players.length < 2) {
    gameState.status = 'waiting';
  }
}

function broadcastGameState() {
  const message = {
    type: 'gameState',
    data: gameState
  };
  
  clients.forEach((client, ws) => {
    sendToClient(ws, message);
  });
}

function sendToClient(ws, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🎮 OpenFront School Edition Server Started!');
  console.log(`📍 Game available at: http://localhost:${PORT}`);
  console.log('👥 Students can now connect and play!');
  console.log('================================');
});