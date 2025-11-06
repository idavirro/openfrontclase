# OpenFront Architecture Documentation

## 🎮 Overview
OpenFront is a multiplayer browser-based strategy game built with TypeScript, featuring real-time gameplay, territory conquest, and complex unit management. It's essentially a battle royale/IO game where players expand their nations and eliminate opponents.

## 🏗️ Core Architecture

### 📁 Project Structure
```
src/
├── client/           # Frontend code (browser)
├── core/            # Shared game logic
└── server/          # Backend code (Node.js)
```

## 🖥️ Client Architecture (`src/client/`)

### 🎨 UI System (Epic Design)
- **`index.html`**: Main game interface with stunning Europe background and gradient logo
- **`styles.css`**: Tailwind-based styling with custom components
- **Aesthetic Features**:
  - Blurred Europe background image
  - Gradient OpenFront logo
  - Glass-morphism effects
  - Dark mode support
  - Responsive design

### 🧩 Component System
- **LitElement-based**: Uses Lit framework for web components
- **Key Components**:
  - `PublicLobby.ts`: Handles matchmaking and public games
  - `HostLobbyModal.ts`: Private lobby creation with full game config
  - `FlagInput.ts`: Country flag selection
  - `UsernameInput.ts`: Player name input with validation
  - `DarkModeButton.ts`: Theme toggle
  - Various game UI components (build menu, chat, etc.)

### 🎮 Game Flow
1. **Main Menu**: Epic UI with username/flag input
2. **Lobby System**: Public lobbies, private lobbies, matchmaking
3. **Game Launch**: `ClientGameRunner.ts` handles game initialization
4. **Transport**: WebSocket communication via `Transport.ts`

## 🎯 Core Game Engine (`src/core/`)

### 🌍 Game System
- **`Game.ts`**: Main game interface and types
- **`GameImpl.ts`**: Actual game implementation
- **Key Concepts**:
  - **Players**: Human/Bot with territories, resources, units
  - **Map**: Tile-based world (Europe, World, Mars, etc.)
  - **Units**: Cities, armies, nukes, ships, etc.
  - **Diplomacy**: Alliances, embargos, relations

### 🗺️ Maps & Geography
- **Maps Available**: 20+ maps including World, Europe, Asia, Mars, Pangaea
- **Categories**: Continental, Regional, Fantasy
- **Terrain Types**: Plains, Highland, Mountain, Lake, Ocean
- **Size Options**: Compact, Normal

### ⚔️ Combat & Units
- **Unit Types**: 
  - **Military**: Armies, Ships, Nukes
  - **Economic**: Cities, Factories, Trade Ships
  - **Defensive**: SAM Launchers, Defense Posts
- **Nuclear Weapons**: Atom Bombs, Hydrogen Bombs, MIRV missiles
- **Transport**: Ships, Trains with rail networks

### 🤝 Diplomacy
- **Alliances**: Temporary agreements with expiration
- **Relations**: Hostile → Neutral → Friendly
- **Trade**: Gold/troop donations
- **Communication**: Emojis, quick chat

## 🖥️ Server Architecture (`src/server/`)

### 🎮 Game Management
- **`GameManager.ts`**: Orchestrates multiple game instances
- **`GameServer.ts`**: Individual game session handler
- **`Client.ts`**: Player connection management
- **Game Phases**: Lobby → Active → Running → Finished

### 🌐 Network Layer
- **WebSocket**: Real-time communication
- **Message Types**: 
  - Client→Server: Join, Intent, Ping
  - Server→Client: Turn updates, Game start, Errors
- **Schema Validation**: Zod-based type safety

### 🏫 School Edition Server
- **`SchoolServer.ts`**: Simplified server for educational use
- **Features**:
  - Single persistent game
  - No IP restrictions
  - Lobby leader system
  - Real-time player updates

## 🔧 Configuration System (`src/core/configuration/`)

### 🎛️ Game Configuration
```typescript
interface GameConfig {
  gameMap: GameMapType;        // Europe, World, Mars, etc.
  difficulty: Difficulty;      // Easy → Impossible
  gameType: GameType;         // Singleplayer, Public, Private
  gameMode: GameMode;         // FFA, Team
  donateGold: boolean;        // Allow gold donations
  donateTroops: boolean;      // Allow troop donations
  infiniteGold: boolean;      // Cheat mode
  instantBuild: boolean;      // No build delays
  disabledUnits: UnitType[];  // Disable specific units
  bots: number;              // AI opponent count
  maxPlayers: number;        // Player limit
}
```

## 📡 Communication Protocol

### 🔄 Message Flow
1. **Client Joins**: Sends username, flag, cosmetics
2. **Server Validates**: Checks name, assigns player ID
3. **Game Updates**: Turn-based state synchronization
4. **Real-time Events**: Chat, diplomacy, unit actions

### 📦 Key Schemas (`src/core/Schemas.ts`)
- **GameStartInfo**: Initial game state
- **Turn**: Player actions for a game tick
- **Intent**: Player actions (attack, build, ally)
- **Player**: Username, flag, cosmetics, stats

## 🎨 Styling System

### 🎭 Design Language
- **Colors**: Blue gradients (#2563eb → #3b82f6)
- **Typography**: Clean sans-serif with weight hierarchy
- **Effects**: Backdrop blur, glass morphism, subtle shadows
- **Animations**: Smooth transitions, hover effects

### 📱 Responsive Design
- **Breakpoints**: Mobile-first with sm/md/lg variants
- **Flexible Layout**: CSS Grid and Flexbox
- **Touch Friendly**: Large buttons, appropriate spacing

## 🚀 Build System

### 📦 Webpack Configuration
- **Development**: Hot reload, source maps
- **Production**: Minification, code splitting
- **Assets**: Images, fonts, maps copied to dist
- **TypeScript**: Full type checking with strict mode

### 🔧 Scripts
```bash
npm run dev           # Start development server
npm run build-prod    # Production build
npm run start:server  # Backend server
npm run school        # School edition
```

## 🧪 Testing
- **Jest**: Unit tests for game logic
- **Type Safety**: Full TypeScript coverage
- **Schema Validation**: Runtime type checking

## 🌟 Key Features

### 🎮 Gameplay
- **Real-time Strategy**: Territory expansion and unit management
- **Diplomatic Complexity**: Alliance system with betrayals
- **Economic Strategy**: Resource management and trading
- **Multiple Victory Conditions**: Elimination, domination

### 🎨 User Experience
- **Stunning Visuals**: Professional game UI
- **Smooth Performance**: Optimized rendering
- **Accessibility**: Keyboard navigation, screen reader support
- **Internationalization**: Multi-language support

### 🏫 Educational Features (School Edition)
- **Simplified Setup**: Single persistent lobby
- **No Account Required**: Just username and flag
- **Teacher Controls**: Lobby leader can configure everything
- **Safe Environment**: No external connections, COPPA compliant

## 🔮 Architecture Benefits

### 🏗️ Modularity
- **Separation of Concerns**: Client/Server/Core boundaries
- **Component System**: Reusable UI components
- **Type Safety**: Compile-time error prevention

### 📈 Scalability
- **Multiple Game Support**: Concurrent game sessions
- **Resource Management**: Automatic cleanup
- **Performance Optimization**: Efficient state updates

### 🔧 Maintainability
- **Clear Structure**: Logical file organization
- **Documentation**: Comprehensive type definitions
- **Testing**: Automated validation

This architecture enables OpenFront to deliver a professional-grade gaming experience while maintaining code quality and educational accessibility.