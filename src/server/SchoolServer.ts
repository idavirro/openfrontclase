// Simplified server for school edition - single game mode
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import { GameManager } from "./GameManager";
import { getServerConfigFromServer } from "../core/configuration/ConfigLoader";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SchoolGameState {
  status: 'waiting' | 'starting' | 'running' | 'finished';
  playerCount: number;
  players: Array<{
    id: string;
    name: string;
    flag: string;
    isSpectator: boolean;
  }>;
  gameId: string | null;
}

class SchoolGameServer {
  private app: express.Application;
  private server: any;
  private wss: WebSocketServer;
  private gameManager: GameManager;
  private gameState: SchoolGameState;
  private clients: Map<any, { id: string; name: string; flag: string; isSpectator: boolean }>;
  
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.gameManager = new GameManager();
    this.clients = new Map();
    
    this.gameState = {
      status: 'waiting',
      playerCount: 0,
      players: [],
      gameId: null
    };
    
    this.setupExpress();
    this.setupWebSocket();
  }
  
  private setupExpress() {
    // Serve static files from dist-school
    const distPath = path.join(__dirname, '../../dist-school');
    this.app.use(express.static(distPath));
    
    // Serve game resources
    const resourcesPath = path.join(__dirname, '../../resources');
    this.app.use('/resources', express.static(resourcesPath));
    
    // API endpoints
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', gameState: this.gameState });
    });
    
    this.app.get('/api/game-state', (req, res) => {
      res.json(this.gameState);
    });
    
    // Catch all handler - serve index.html for any route
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  
  private setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('New client connected');
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('Client disconnected');
        this.handleClientDisconnect(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
      
      // Send initial game state
      this.sendToClient(ws, {
        type: 'gameState',
        data: this.gameState
      });
    });
  }
  
  private handleMessage(ws: any, message: any) {
    switch (message.type) {
      case 'requestGameState':
        this.sendToClient(ws, {
          type: 'gameState',
          data: this.gameState
        });
        break;
        
      case 'joinGame':
        this.handleJoinGame(ws, message.data);
        break;
        
      case 'spectateGame':
        this.handleSpectateGame(ws, message.data);
        break;
        
      case 'leaveGame':
        this.handleLeaveGame(ws);
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  }
  
  private handleJoinGame(ws: any, data: any) {
    const { playerName, playerFlag } = data;
    
    if (!playerName || playerName.length > 20) {
      this.sendToClient(ws, {
        type: 'error',
        data: { message: 'Invalid player name' }
      });
      return;
    }
    
    // Check if name is already taken
    const existingPlayer = Array.from(this.clients.values()).find(
      client => client.name === playerName && !client.isSpectator
    );
    
    if (existingPlayer) {
      this.sendToClient(ws, {
        type: 'error',
        data: { message: 'Name already taken' }
      });
      return;
    }
    
    // Add client
    const clientId = Math.random().toString(36).substr(2, 9);
    this.clients.set(ws, {
      id: clientId,
      name: playerName,
      flag: playerFlag || 'us',
      isSpectator: false
    });
    
    this.updateGameState();
    this.broadcastGameState();
    
    // Start game if we have enough players (2+ for school edition)
    if (this.gameState.playerCount >= 2 && this.gameState.status === 'waiting') {
      this.startGame();
    }
    
    console.log(`Player ${playerName} joined the game`);
  }
  
  private handleSpectateGame(ws: any, data: any) {
    const { playerName, playerFlag } = data;
    const clientId = Math.random().toString(36).substr(2, 9);
    
    this.clients.set(ws, {
      id: clientId,
      name: playerName || 'Spectator',
      flag: playerFlag || 'us',
      isSpectator: true
    });
    
    this.updateGameState();
    this.broadcastGameState();
    
    console.log(`Spectator ${playerName || 'Spectator'} joined`);
  }
  
  private handleLeaveGame(ws: any) {
    const client = this.clients.get(ws);
    if (client) {
      console.log(`${client.name} left the game`);
      this.clients.delete(ws);
      this.updateGameState();
      this.broadcastGameState();
      
      // If no players left, reset game
      if (this.gameState.playerCount === 0) {
        this.resetGame();
      }
    }
  }
  
  private handleClientDisconnect(ws: any) {
    this.handleLeaveGame(ws);
  }
  
  private updateGameState() {
    const allClients = Array.from(this.clients.values());
    const players = allClients.filter(client => !client.isSpectator);
    
    this.gameState.playerCount = players.length;
    this.gameState.players = allClients.map(client => ({
      id: client.id,
      name: client.name,
      flag: client.flag,
      isSpectator: client.isSpectator
    }));
  }
  
  private startGame() {
    console.log('Starting game with', this.gameState.playerCount, 'players');
    this.gameState.status = 'starting';
    this.gameState.gameId = Math.random().toString(36).substr(2, 9);
    
    this.broadcastGameState();
    
    // Simulate game start delay
    setTimeout(() => {
      this.gameState.status = 'running';
      this.broadcastGameState();
      
      // Auto-end game after 10 minutes for demo purposes
      setTimeout(() => {
        this.endGame();
      }, 10 * 60 * 1000);
      
    }, 3000);
  }
  
  private endGame() {
    console.log('Game ended');
    this.gameState.status = 'finished';
    this.broadcastGameState();
    
    // Reset game after 30 seconds
    setTimeout(() => {
      this.resetGame();
    }, 30000);
  }
  
  private resetGame() {
    console.log('Resetting game');
    this.gameState.status = 'waiting';
    this.gameState.gameId = null;
    this.broadcastGameState();
  }
  
  private broadcastGameState() {
    const message = {
      type: 'gameState',
      data: this.gameState
    };
    
    this.clients.forEach((client, ws) => {
      this.sendToClient(ws, message);
    });
  }
  
  private sendToClient(ws: any, message: any) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  
  public start(port: number = 3001) {
    this.server.listen(port, '0.0.0.0', () => {
      console.log(`School OpenFront server running on port ${port}`);
      console.log(`Game available at: http://localhost:${port}`);
      console.log('WebSocket server ready for connections');
    });
  }
}

// Start the server
const server = new SchoolGameServer();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
server.start(port);