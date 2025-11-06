// School Edition Main - Simplified version for single game mode
import { EventBus } from "../core/EventBus";
import { generateCryptoRandomUUID } from "./Utils";

// Game state
let isConnected = false;
let isInGame = false;
let currentPlayers: Array<{ name: string; flag: string; id: string }> = [];
let gameTransport: WebSocket | null = null;

// DOM elements
let statusElement: HTMLElement;
let setupFormElement: HTMLElement;
let playersSection: HTMLElement;
let playersListElement: HTMLElement;
let gameControlsElement: HTMLElement;
let usernameInput: HTMLInputElement;
let flagSelect: HTMLSelectElement;
let joinButton: HTMLButtonElement;
let spectateButton: HTMLButtonElement;
let leaveButton: HTMLButtonElement;

// Initialize the simplified client
async function initSchoolClient() {
  console.log("Initializing School Edition...");
  
  // Get DOM elements
  statusElement = document.getElementById('game-status')!;
  setupFormElement = document.getElementById('setup-form')!;
  playersSection = document.getElementById('players-section')!;
  playersListElement = document.getElementById('players-list')!;
  gameControlsElement = document.getElementById('game-controls')!;
  usernameInput = document.getElementById('username') as HTMLInputElement;
  flagSelect = document.getElementById('flag') as HTMLSelectElement;
  joinButton = document.getElementById('join-game') as HTMLButtonElement;
  spectateButton = document.getElementById('spectate-game') as HTMLButtonElement;
  leaveButton = document.getElementById('leave-game') as HTMLButtonElement;

  // Set up event listeners
  joinButton.addEventListener('click', handleJoinGame);
  spectateButton.addEventListener('click', handleSpectateGame);
  leaveButton.addEventListener('click', handleLeaveGame);

  // Load saved username and flag
  loadSavedSettings();

  // Connect to server
  await connectToServer();
}

function loadSavedSettings() {
  const savedUsername = localStorage.getItem('school-username');
  const savedFlag = localStorage.getItem('school-flag');
  
  if (savedUsername) {
    usernameInput.value = savedUsername;
  }
  
  if (savedFlag) {
    flagSelect.value = savedFlag;
  }
}

function saveSettings() {
  localStorage.setItem('school-username', usernameInput.value);
  localStorage.setItem('school-flag', flagSelect.value);
}

async function connectToServer() {
  try {
    updateStatus('Connecting to game server...', 'info');
    
    // Simple WebSocket connection for school edition
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = window.location.hostname === 'localhost' ? '3001' : window.location.port;
    const serverUrl = `${protocol}//${host}:${port}`;
    
    const ws = new WebSocket(serverUrl);
    
    ws.onopen = () => {
      console.log('Connected to server');
      gameTransport = ws;
      handleServerConnected();
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
      } catch (error) {
        console.error('Error parsing server message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from server');
      handleServerDisconnected();
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      updateStatus('Failed to connect to game server.', 'error');
    };
    
  } catch (error) {
    console.error('Failed to connect to server:', error);
    updateStatus('Failed to connect to game server. Make sure the server is running.', 'error');
  }
}

function handleServerConnected() {
  console.log('Connected to server');
  isConnected = true;
  updateStatus('Connected! Enter your name and join the game.', 'success');
  
  // Request current game state
  requestGameState();
}

function handleServerDisconnected() {
  console.log('Disconnected from server');
  isConnected = false;
  isInGame = false;
  updateStatus('Disconnected from server. Attempting to reconnect...', 'error');
  
  // Hide game UI
  hideGameUI();
  
  // Attempt to reconnect after 3 seconds
  setTimeout(connectToServer, 3000);
}

function handleServerMessage(message: any) {
  switch (message.type) {
    case 'gameState':
      handleGameStateUpdate(message.data);
      break;
    case 'playersUpdate':
      handlePlayersUpdate(message.data);
      break;
    case 'error':
      updateStatus(message.data.message || 'Server error', 'error');
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

function handleGameStateUpdate(gameState: any) {
  
  if (gameState.status === 'waiting') {
    updateStatus(`Game lobby - ${gameState.playerCount || 0} players connected`, 'info');
  } else if (gameState.status === 'starting') {
    updateStatus('Game is starting...', 'info');
  } else if (gameState.status === 'running') {
    updateStatus('Game in progress', 'success');
  } else if (gameState.status === 'finished') {
    updateStatus('Game finished. New game will start soon.', 'info');
  }
}

function handlePlayersUpdate(players: any) {
  currentPlayers = players;
  updatePlayersList();
}

function requestGameState() {
  if (gameTransport && isConnected && gameTransport.readyState === WebSocket.OPEN) {
    gameTransport.send(JSON.stringify({
      type: 'requestGameState'
    }));
  }
}

async function handleJoinGame() {
  const username = usernameInput.value.trim();
  const flag = flagSelect.value;
  
  if (!username) {
    alert('Please enter your name');
    return;
  }
  
  if (username.length > 20) {
    alert('Name must be 20 characters or less');
    return;
  }
  
  if (!isConnected) {
    alert('Not connected to server');
    return;
  }
  
  try {
    saveSettings();
    updateStatus('Joining game...', 'info');
    
    // Send join game message to server
    if (gameTransport && gameTransport.readyState === WebSocket.OPEN) {
      gameTransport.send(JSON.stringify({
        type: 'joinGame',
        data: {
          playerName: username,
          playerFlag: flag
        }
      }));
    } else {
      throw new Error('Not connected to server');
    }
    
    isInGame = true;
    showGameUI();
    updateStatus('In game', 'success');
    
  } catch (error) {
    console.error('Failed to join game:', error);
    updateStatus('Failed to join game', 'error');
  }
}

async function handleSpectateGame() {
  const username = usernameInput.value.trim() || 'Spectator';
  const flag = flagSelect.value;
  
  if (!isConnected) {
    alert('Not connected to server');
    return;
  }
  
  try {
    saveSettings();
    updateStatus('Joining as spectator...', 'info');
    
    // Send spectate message to server
    if (gameTransport && gameTransport.readyState === WebSocket.OPEN) {
      gameTransport.send(JSON.stringify({
        type: 'spectateGame',
        data: {
          playerName: username,
          playerFlag: flag
        }
      }));
    } else {
      throw new Error('Not connected to server');
    }
    
    isInGame = true;
    showGameUI();
    updateStatus('Spectating game', 'success');
    
  } catch (error) {
    console.error('Failed to spectate game:', error);
    updateStatus('Failed to spectate game', 'error');
  }
}

function handleLeaveGame() {
  if (isInGame) {
    // Send leave message to server
    if (gameTransport && gameTransport.readyState === WebSocket.OPEN) {
      gameTransport.send(JSON.stringify({
        type: 'leaveGame'
      }));
    }
    
    isInGame = false;
    hideGameUI();
    updateStatus('Left game', 'info');
  }
}

function updateStatus(message: string, type: 'info' | 'success' | 'error') {
  statusElement.textContent = message;
  statusElement.className = `status status-${type === 'error' ? 'info' : type}`;
}

function updatePlayersList() {
  if (currentPlayers.length === 0) {
    playersSection.style.display = 'none';
    return;
  }
  
  playersSection.style.display = 'block';
  playersListElement.innerHTML = '';
  
  currentPlayers.forEach(player => {
    const playerElement = document.createElement('div');
    playerElement.className = 'player-item';
    playerElement.innerHTML = `
      <img src="/flags/${player.flag}.svg" alt="${player.flag}" class="flag-display" />
      <span>${player.name}</span>
    `;
    playersListElement.appendChild(playerElement);
  });
}

function showGameUI() {
  // Hide setup form
  setupFormElement.style.display = 'none';
  playersSection.style.display = 'none';
  
  // Show game controls
  gameControlsElement.style.display = 'block';
  
  // Show game canvas and UI elements
  const gameElements = [
    'app', 'radialMenu', 
    '.flex.gap-2.fixed.right-\\[10px\\].top-\\[10px\\]',
    '.fixed.bottom-\\[30px\\]',
    '.bottom-0.w-full.flex-col-reverse'
  ];
  
  gameElements.forEach(selector => {
    const element = document.querySelector(`#${selector}`) || document.querySelector(selector);
    if (element && element instanceof HTMLElement) {
      element.style.display = '';
    }
  });
}

function hideGameUI() {
  // Show setup form
  setupFormElement.style.display = 'block';
  if (currentPlayers.length > 0) {
    playersSection.style.display = 'block';
  }
  
  // Hide game controls
  gameControlsElement.style.display = 'none';
  
  // Hide game canvas and UI elements
  const gameElements = [
    'app', 'radialMenu',
    '.flex.gap-2.fixed.right-\\[10px\\].top-\\[10px\\]',
    '.fixed.bottom-\\[30px\\]',
    '.bottom-0.w-full.flex-col-reverse'
  ];
  
  gameElements.forEach(selector => {
    const element = document.querySelector(`#${selector}`) || document.querySelector(selector);
    if (element && element instanceof HTMLElement) {
      element.style.display = 'none';
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSchoolClient);

// Handle page visibility changes (for when tab is switched)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause game updates when tab is hidden
    console.log('Tab hidden - pausing updates');
  } else {
    // Resume when tab is visible
    console.log('Tab visible - resuming updates');
    if (isConnected && !isInGame) {
      requestGameState();
    }
  }
});