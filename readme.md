# Pocket Agency

A cross-platform 2D game built with TypeScript, Phaser.js, and Capacitor. Manage AI agents, assign missions, and watch them complete tasks in real-time.

## 🎮 Features

- **Cross-Platform**: Play on web browsers, Android, and iOS
- **AI Agents**: Manage different types of agents (Scout, Engineer, Diplomat, Trader)
- **Mission System**: Assign missions to agents and track progress in real-time
- **Progression System**: Level up agents and unlock new features
- **Server API**: RESTful backend for syncing game state

## 📁 Project Structure

```
pocket-agency/
├── core-engine/          # Core game logic (TypeScript modules)
│   └── src/
│       ├── Agent.ts      # Agent class and management
│       ├── Mission.ts    # Mission logic and progression
│       ├── Progression.ts # Unlocking system
│       ├── Network.ts    # API client module
│       └── index.ts      # Module exports
├── web-client/           # Phaser.js web client
│   ├── src/
│   │   ├── scenes/
│   │   │   └── AgencyHubScene.ts  # Main game scene
│   │   └── index.ts      # Game initialization
│   ├── public/
│   │   └── index.html    # HTML template
│   └── webpack.config.js # Build configuration
├── mobile-client/        # Capacitor mobile wrapper
│   └── capacitor.config.json
├── server/               # Node.js/Express backend
│   └── src/
│       └── index.ts      # API endpoints
└── assets/               # Game assets
    ├── sprites/          # Character and object sprites
    ├── tiles/            # Tileset images
    └── sounds/           # Sound effects and music
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- For mobile development:
  - Android: Android Studio and Java JDK
  - iOS: macOS with Xcode

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheCaptainKimchi/pocket-agency.git
   cd pocket-agency
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install:all
   ```

3. **Build core engine**
   ```bash
   npm run build:core
   ```

## 🌐 Running the Web Client

### Development Mode

1. **Start the development server**
   ```bash
   npm run dev:web
   ```

2. **Open your browser**
   Navigate to `http://localhost:8080`

### Production Build

```bash
npm run build:web
```

The built files will be in `web-client/dist/`

## 🖥️ Running the Backend Server

### Development Mode

```bash
npm run dev:server
```

The server will start on `http://localhost:3000`

### API Endpoints

- `GET /health` - Health check
- `GET /api/missions/available` - Get available missions
- `GET /api/missions/updates` - Get mission progress updates
- `POST /api/missions/assign` - Assign mission to agent
- `GET /api/agents` - Get all agents
- `GET /api/agents/:agentId` - Get specific agent

## 📱 Running on Mobile

### Setup Capacitor

1. **Build the web client first**
   ```bash
   npm run build:web
   ```

2. **Sync Capacitor**
   ```bash
   npm run mobile:sync
   ```

### Android

1. **Add Android platform** (first time only)
   ```bash
   cd mobile-client
   npx cap add android
   ```

2. **Open in Android Studio**
   ```bash
   npm run mobile:open:android
   ```

3. **Run on emulator or device** from Android Studio

### iOS

1. **Add iOS platform** (first time only, macOS required)
   ```bash
   cd mobile-client
   npx cap add ios
   ```

2. **Open in Xcode**
   ```bash
   npm run mobile:open:ios
   ```

3. **Run on simulator or device** from Xcode

## 🎯 How to Play

1. **View Your Agents**: Three agents are displayed at the top of the screen
   - Scout Alpha (Green) - Specializes in exploration
   - Engineer Beta (Blue) - Specializes in building
   - Diplomat Gamma (Orange) - Specializes in negotiation

2. **Assign Missions**: Click on mission buttons to assign them to available agents
   - Agents must be IDLE to accept missions
   - Missions show duration and rewards

3. **Watch Progress**: Agents will automatically complete missions
   - Progress is shown as a percentage
   - Agents return to IDLE when complete
   - Experience is gained upon completion

## 🛠️ Development

### Build All Packages

```bash
npm run build
```

### Project Scripts

- `npm run build:core` - Build core engine
- `npm run build:web` - Build web client
- `npm run build:server` - Build server
- `npm run dev:web` - Start web dev server
- `npm run dev:server` - Start backend server
- `npm run mobile:sync` - Sync mobile platforms

## 📦 Technology Stack

- **TypeScript** - Strongly typed JavaScript
- **Phaser 3** - HTML5 game framework
- **Capacitor** - Cross-platform mobile runtime
- **Express** - Node.js web framework
- **Webpack** - Module bundler

## 🔧 Configuration

### Web Client
- Port: 8080 (development)
- Configuration: `web-client/webpack.config.js`

### Server
- Port: 3000 (default, configurable via PORT env variable)
- Configuration: `server/src/index.ts`

### Mobile
- Configuration: `mobile-client/capacitor.config.json`
- App ID: `com.pocketagency.app`
- App Name: Pocket Agency

## 🎨 Customization

### Adding New Agent Types

1. Edit `core-engine/src/Agent.ts` to add new `AgentType` enum values
2. Update the color mapping in `web-client/src/scenes/AgencyHubScene.ts`
3. Create new agent instances in the scene's `createInitialAgents()` method

### Adding New Missions

Edit `web-client/src/scenes/AgencyHubScene.ts` in the `createSampleMissions()` method:

```typescript
new Mission(
  'mission-id',
  'Mission Name',
  'Description',
  30000, // duration in milliseconds
  { experience: 100, currency: 200 }
)
```

### Customizing Progression

Edit `core-engine/src/Progression.ts` to add new unlockable features in `initializeDefaultFeatures()`

## 🐛 Troubleshooting

### Web client won't start
- Ensure core-engine is built: `npm run build:core`
- Clear node_modules and reinstall: `npm run install:all`

### Mobile build fails
- Ensure web client is built first: `npm run build:web`
- Run `npm run mobile:sync` after building web client

### Server connection issues
- Check that server is running on port 3000
- Update base URL in `web-client/src/scenes/AgencyHubScene.ts` if needed
- Network polling is commented out by default - uncomment to enable

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions and support, please open an issue on GitHub.
