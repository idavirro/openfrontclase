import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { GameMapType, Difficulty, UnitType } from "../core/game/Game";
import "./components/baseComponents/Modal";
import "./components/baseComponents/Button";

interface SchoolPlayer {
  id: string;
  name: string;
  flag: string;
  isSpectator: boolean;
  isLobbyLeader?: boolean;
}

interface SchoolGameState {
  status: 'waiting' | 'starting' | 'running' | 'finished';
  playerCount: number;
  players: SchoolPlayer[];
  gameId: string | null;
  config?: any;
}

@customElement("school-lobby-modal")
export class SchoolLobbyModal extends LitElement {
  static styles = css`
    .school-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .school-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .school-title {
      font-size: 2.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #10b981, #059669);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .school-subtitle {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .status-card {
      background: rgba(16, 185, 129, 0.1);
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
    }

    .status-error {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
      color: #dc2626;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 12px;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      background: #f9fafb;
      transition: all 0.2s;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .flag-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 8px;
      border: 2px solid #d1d5db;
      margin-bottom: 1rem;
    }

    .flag-option {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .flag-option:hover {
      background: rgba(16, 185, 129, 0.1);
      border-color: #10b981;
    }

    .flag-option.selected {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      font-weight: 600;
    }

    .flag-emoji {
      margin-right: 0.5rem;
      font-size: 18px;
    }

    .config-section {
      background: #f9fafb;
      border: 2px solid #d1d5db;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .config-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #374151;
      border-bottom: 2px solid #10b981;
      padding-bottom: 0.5rem;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .checkbox-item:hover {
      background: rgba(16, 185, 129, 0.05);
      border-color: #10b981;
    }

    .checkbox-item input {
      margin-right: 0.5rem;
      transform: scale(1.2);
    }

    .players-list {
      background: #f9fafb;
      border: 2px solid #d1d5db;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .player-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .player-item:hover {
      transform: translateX(4px);
    }

    .player-flag {
      margin-right: 0.75rem;
      font-size: 20px;
    }

    .player-name {
      flex: 1;
      font-weight: 500;
    }

    .player-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-leader {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .badge-spectator {
      background: #6b7280;
      color: white;
    }

    .button-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .range-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .range-value {
      text-align: center;
      font-weight: 600;
      color: #10b981;
      font-size: 1.1rem;
    }
  `;

  @state() private isModalOpen = false;
  @state() private wsConnection: WebSocket | null = null;
  @state() private serverConnected = false;
  @state() private gameState: SchoolGameState = {
    status: 'waiting',
    playerCount: 0,
    players: [],
    gameId: null
  };
  @state() private selectedFlag = 'us';
  @state() private username = '';
  @state() private isLobbyLeader = false;
  @state() private flagSearch = '';
  @state() private gameConfig = {
    gameMap: 'Europe',
    difficulty: 'Medium',
    maxPlayers: 8,
    bots: 2,
    donateGold: true,
    donateTroops: true,
    atomBombs: true,
    hydrogenBombs: false,
    mirv: true,
    instantBuild: false,
    infiniteGold: false,
    infiniteTroops: false
  };

  private flags = [
    { code: 'us', name: 'United States', emoji: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', emoji: '🇬🇧' },
    { code: 'fr', name: 'France', emoji: '🇫🇷' },
    { code: 'de', name: 'Germany', emoji: '🇩🇪' },
    { code: 'it', name: 'Italy', emoji: '🇮🇹' },
    { code: 'es', name: 'Spain', emoji: '🇪🇸' },
    { code: 'ca', name: 'Canada', emoji: '🇨🇦' },
    { code: 'au', name: 'Australia', emoji: '🇦🇺' },
    { code: 'jp', name: 'Japan', emoji: '🇯🇵' },
    { code: 'br', name: 'Brazil', emoji: '🇧🇷' },
    { code: 'mx', name: 'Mexico', emoji: '🇲🇽' },
    { code: 'in', name: 'India', emoji: '🇮🇳' },
    { code: 'cn', name: 'China', emoji: '🇨🇳' },
    { code: 'ru', name: 'Russia', emoji: '🇷🇺' },
    { code: 'kr', name: 'South Korea', emoji: '🇰🇷' },
    { code: 'ar', name: 'Argentina', emoji: '🇦🇷' },
    { code: 'cl', name: 'Chile', emoji: '🇨🇱' },
    { code: 'za', name: 'South Africa', emoji: '🇿🇦' },
    { code: 'eg', name: 'Egypt', emoji: '🇪🇬' },
    { code: 'ng', name: 'Nigeria', emoji: '🇳🇬' },
    { code: 'tr', name: 'Turkey', emoji: '🇹🇷' },
    { code: 'sa', name: 'Saudi Arabia', emoji: '🇸🇦' },
    { code: 'ae', name: 'UAE', emoji: '🇦🇪' },
    { code: 'th', name: 'Thailand', emoji: '🇹🇭' },
    { code: 'vn', name: 'Vietnam', emoji: '🇻🇳' },
    { code: 'ph', name: 'Philippines', emoji: '🇵🇭' },
    { code: 'id', name: 'Indonesia', emoji: '🇮🇩' },
    { code: 'my', name: 'Malaysia', emoji: '🇲🇾' },
    { code: 'sg', name: 'Singapore', emoji: '🇸🇬' },
    { code: 'nz', name: 'New Zealand', emoji: '🇳🇿' }
  ];

  firstUpdated() {
    this.loadSavedSettings();
  }

  open() {
    this.isModalOpen = true;
    document.getElementById('page-title')!.textContent = 'OpenFront - School Edition';
    this.connectToServer();
  }

  close() {
    this.isModalOpen = false;
    document.getElementById('page-title')!.textContent = 'OpenFront (ALPHA)';
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  private loadSavedSettings() {
    const savedUsername = localStorage.getItem('school-username');
    const savedFlag = localStorage.getItem('school-flag');
    
    if (savedUsername) this.username = savedUsername;
    if (savedFlag) this.selectedFlag = savedFlag;
  }

  private saveSettings() {
    localStorage.setItem('school-username', this.username);
    localStorage.setItem('school-flag', this.selectedFlag);
  }

  private async connectToServer() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = window.location.hostname === 'localhost' ? '3001' : window.location.port;
      const serverUrl = `${protocol}//${host}:${port}`;
      
      this.wsConnection = new WebSocket(serverUrl);
      
      this.wsConnection.onopen = () => {
        this.serverConnected = true;
        this.requestUpdate();
      };
      
      this.wsConnection.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleServerMessage(message);
      };
      
      this.wsConnection.onclose = () => {
        this.serverConnected = false;
        this.requestUpdate();
        // Auto-reconnect
        setTimeout(() => this.connectToServer(), 3000);
      };
      
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }

  private handleServerMessage(message: any) {
    switch (message.type) {
      case 'gameState':
        this.gameState = message.data;
        this.checkLobbyLeader();
        this.requestUpdate();
        break;
      case 'gameStarted':
        // Transition to actual game
        this.close();
        break;
      case 'error':
        console.error('Server error:', message.data.message);
        break;
    }
  }

  private checkLobbyLeader() {
    const currentPlayer = this.gameState.players.find(p => 
      p.name === this.username && !p.isSpectator
    );
    this.isLobbyLeader = currentPlayer?.isLobbyLeader || false;
  }

  private sendMessage(message: any) {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message));
    }
  }

  private handleJoinGame() {
    if (!this.username.trim()) {
      alert('Please enter your name');
      return;
    }
    
    this.saveSettings();
    this.sendMessage({
      type: 'joinGame',
      data: {
        playerName: this.username,
        playerFlag: this.selectedFlag
      }
    });
  }

  private handleSpectateGame() {
    const name = this.username.trim() || 'Spectator';
    this.sendMessage({
      type: 'spectateGame',
      data: {
        playerName: name,
        playerFlag: this.selectedFlag
      }
    });
  }

  private handleStartGame() {
    if (!this.isLobbyLeader) return;
    
    this.sendMessage({
      type: 'startGame',
      data: { config: this.gameConfig }
    });
  }

  private get filteredFlags() {
    if (!this.flagSearch) return this.flags;
    const search = this.flagSearch.toLowerCase();
    return this.flags.filter(flag => 
      flag.name.toLowerCase().includes(search) || 
      flag.code.toLowerCase().includes(search)
    );
  }

  render() {
    if (!this.isModalOpen) return html``;

    return html`
      <o-modal>
        <div class="school-container">
          <div class="school-header">
            <h1 class="school-title">🏫 School Edition</h1>
            <p class="school-subtitle">Multiplayer Strategy for Classrooms</p>
          </div>

          <!-- Status -->
          <div class="status-card ${!this.serverConnected ? 'status-error' : ''}">
            ${this.serverConnected 
              ? html`✅ Connected - ${this.gameState.playerCount} players in lobby`
              : html`🔄 Connecting to server...`
            }
          </div>

          <!-- Player Setup -->
          ${this.renderPlayerSetup()}

          <!-- Game Configuration (Lobby Leader Only) -->
          ${this.isLobbyLeader ? this.renderGameConfig() : ''}

          <!-- Current Players -->
          ${this.gameState.players.length > 0 ? this.renderPlayersList() : ''}

          <!-- Action Buttons -->
          <div class="button-grid">
            <o-button 
              @click=${this.handleJoinGame}
              ?disabled=${!this.serverConnected}
              style="background: linear-gradient(135deg, #10b981, #059669);"
            >
              🚀 Join Game
            </o-button>
            <o-button 
              @click=${this.handleSpectateGame}
              ?disabled=${!this.serverConnected}
              secondary
            >
              👁️ Spectate
            </o-button>
          </div>

          ${this.isLobbyLeader ? html`
            <o-button 
              @click=${this.handleStartGame}
              ?disabled=${this.gameState.playerCount < 2}
              style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 100%;"
            >
              🎯 Start Game Now!
            </o-button>
          ` : ''}

          <o-button @click=${this.close} secondary style="width: 100%; margin-top: 1rem;">
            ← Back to Main Menu
          </o-button>
        </div>
      </o-modal>
    `;
  }

  private renderPlayerSetup() {
    return html`
      <div class="config-section">
        <h3 class="config-title">Player Setup</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input 
              class="form-input"
              .value=${this.username}
              @input=${(e: any) => this.username = e.target.value}
              placeholder="Enter your name"
              maxlength="20"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Search Flags</label>
            <input 
              class="form-input"
              .value=${this.flagSearch}
              @input=${(e: any) => this.flagSearch = e.target.value}
              placeholder="Search countries..."
            />
          </div>
        </div>

        <label class="form-label">Choose Your Flag</label>
        <div class="flag-grid">
          ${this.filteredFlags.map(flag => html`
            <div 
              class="flag-option ${flag.code === this.selectedFlag ? 'selected' : ''}"
              @click=${() => this.selectedFlag = flag.code}
            >
              <span class="flag-emoji">${flag.emoji}</span>
              <span>${flag.name}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private renderGameConfig() {
    return html`
      <div class="config-section">
        <h3 class="config-title">🎛️ Game Configuration</h3>
        <p style="color: #6b7280; margin-bottom: 1rem;">
          You are the lobby leader! Configure the game settings below.
        </p>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Map</label>
            <select 
              class="form-select"
              .value=${this.gameConfig.gameMap}
              @change=${(e: any) => this.gameConfig.gameMap = e.target.value}
            >
              <option value="World">🌍 World</option>
              <option value="Europe">🇪🇺 Europe</option>
              <option value="North America">🇺🇸 North America</option>
              <option value="Asia">🌏 Asia</option>
              <option value="Africa">🌍 Africa</option>
              <option value="South America">🇧🇷 South America</option>
              <option value="Britannia">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Britannia</option>
              <option value="Mars">🔴 Mars</option>
              <option value="Pangaea">🌋 Pangaea</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Difficulty</label>
            <select 
              class="form-select"
              .value=${this.gameConfig.difficulty}
              @change=${(e: any) => this.gameConfig.difficulty = e.target.value}
            >
              <option value="Easy">🟢 Easy</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Hard">🔴 Hard</option>
              <option value="Impossible">💀 Impossible</option>
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="range-group">
            <label class="form-label">Max Players</label>
            <input 
              type="range" 
              min="2" 
              max="20" 
              .value=${this.gameConfig.maxPlayers}
              @input=${(e: any) => this.gameConfig.maxPlayers = parseInt(e.target.value)}
            />
            <div class="range-value">${this.gameConfig.maxPlayers} players</div>
          </div>

          <div class="range-group">
            <label class="form-label">AI Bots</label>
            <input 
              type="range" 
              min="0" 
              max="10" 
              .value=${this.gameConfig.bots}
              @input=${(e: any) => this.gameConfig.bots = parseInt(e.target.value)}
            />
            <div class="range-value">${this.gameConfig.bots} bots</div>
          </div>
        </div>

        <label class="form-label">Game Features</label>
        <div class="checkbox-grid">
          ${this.renderCheckbox('donateGold', '💰 Gold Donations')}
          ${this.renderCheckbox('donateTroops', '🪖 Troop Donations')}
          ${this.renderCheckbox('atomBombs', '💣 Atom Bombs')}
          ${this.renderCheckbox('hydrogenBombs', '☢️ Hydrogen Bombs')}
          ${this.renderCheckbox('mirv', '🚀 MIRV Missiles')}
          ${this.renderCheckbox('instantBuild', '⚡ Instant Build')}
          ${this.renderCheckbox('infiniteGold', '💎 Infinite Gold')}
          ${this.renderCheckbox('infiniteTroops', '👥 Infinite Troops')}
        </div>
      </div>
    `;
  }

  private renderCheckbox(key: keyof typeof this.gameConfig, label: string) {
    return html`
      <label class="checkbox-item">
        <input 
          type="checkbox" 
          .checked=${this.gameConfig[key]}
          @change=${(e: any) => this.gameConfig = {...this.gameConfig, [key]: e.target.checked}}
        />
        <span>${label}</span>
      </label>
    `;
  }

  private renderPlayersList() {
    return html`
      <div class="config-section">
        <h3 class="config-title">👥 Players in Lobby</h3>
        <div class="players-list">
          ${this.gameState.players.map(player => html`
            <div class="player-item">
              <span class="player-flag">${this.getFlagEmoji(player.flag)}</span>
              <span class="player-name">${player.name}</span>
              ${player.isLobbyLeader ? html`
                <span class="player-badge badge-leader">Leader</span>
              ` : player.isSpectator ? html`
                <span class="player-badge badge-spectator">Spectator</span>
              ` : ''}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private getFlagEmoji(countryCode: string): string {
    const flag = this.flags.find(f => f.code === countryCode);
    return flag ? flag.emoji : '🏳️';
  }
}