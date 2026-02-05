import Phaser from 'phaser';
import { Agent, AgentType, AgentStatus, Mission, MissionStatus, Network } from 'core-engine';

/**
 * AgencyHubScene
 * Main game scene displaying agents, missions, and UI
 */
export class AgencyHubScene extends Phaser.Scene {
  private agents: Agent[] = [];
  private missions: Mission[] = [];
  private agentSprites: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private agentTexts: Map<string, Phaser.GameObjects.Text> = new Map();
  private missionButtons: Phaser.GameObjects.Container[] = [];
  private statusText?: Phaser.GameObjects.Text;
  private network?: Network;
  private lastUpdateTime: number = 0;
  private readonly UPDATE_INTERVAL = 100; // milliseconds

  constructor() {
    super({ key: 'AgencyHubScene' });
  }

  /**
   * Initialize scene
   */
  init(): void {
    console.log('Initializing AgencyHubScene');
    
    // Initialize network client
    this.network = new Network({
      baseUrl: 'http://localhost:3000',
      pollInterval: 10000, // Poll every 10 seconds
      timeout: 5000
    });

    // Create initial agents
    this.createInitialAgents();
    
    // Create sample missions
    this.createSampleMissions();
  }

  /**
   * Preload assets
   */
  preload(): void {
    // Placeholder for asset loading
    // In the future, load sprites, tiles, sounds here
  }

  /**
   * Create scene elements
   */
  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.add.rectangle(0, 0, width, height, 0x16213e).setOrigin(0, 0);

    // Title
    this.add.text(width / 2, 40, 'Pocket Agency', {
      fontSize: '32px',
      color: '#e94560',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 75, 'Manage Your AI Agents', {
      fontSize: '16px',
      color: '#f1f1f1'
    }).setOrigin(0.5);

    // Create agent displays
    this.createAgentDisplays();

    // Create mission buttons
    this.createMissionButtons();

    // Status text
    this.statusText = this.add.text(width / 2, height - 30, '', {
      fontSize: '14px',
      color: '#a0a0a0'
    }).setOrigin(0.5);

    // Start network polling (commented out for now as server may not be running)
    // this.startNetworkPolling();

    this.updateStatusText('Ready! Assign missions to your agents.');
  }

  /**
   * Update loop
   */
  update(time: number): void {
    // Update agents periodically
    if (time - this.lastUpdateTime > this.UPDATE_INTERVAL) {
      this.updateAgents();
      this.lastUpdateTime = time;
    }
  }

  /**
   * Create initial agents
   */
  private createInitialAgents(): void {
    this.agents = [
      new Agent('agent-1', 'Scout Alpha', AgentType.SCOUT),
      new Agent('agent-2', 'Engineer Beta', AgentType.ENGINEER),
      new Agent('agent-3', 'Diplomat Gamma', AgentType.DIPLOMAT)
    ];
  }

  /**
   * Create sample missions
   */
  private createSampleMissions(): void {
    this.missions = [
      new Mission(
        'mission-1',
        'Resource Survey',
        'Survey nearby area for resources',
        15000, // 15 seconds
        { experience: 50, currency: 100 }
      ),
      new Mission(
        'mission-2',
        'Build Prototype',
        'Construct a prototype device',
        25000, // 25 seconds
        { experience: 75, currency: 150 }
      ),
      new Mission(
        'mission-3',
        'Negotiate Trade',
        'Establish trade agreement',
        20000, // 20 seconds
        { experience: 60, currency: 120 }
      )
    ];
  }

  /**
   * Create agent visual displays
   */
  private createAgentDisplays(): void {
    const startX = 150;
    const startY = 150;
    const spacing = 250;

    this.agents.forEach((agent, index) => {
      const x = startX + (index * spacing);
      const y = startY;

      // Agent "sprite" - colored rectangle
      const color = this.getAgentColor(agent.type);
      const sprite = this.add.rectangle(x, y, 80, 80, color);
      sprite.setStrokeStyle(3, 0xffffff);
      this.agentSprites.set(agent.id, sprite);

      // Agent name
      this.add.text(x, y - 60, agent.name, {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Agent type
      this.add.text(x, y - 40, agent.type.toUpperCase(), {
        fontSize: '12px',
        color: '#a0a0a0'
      }).setOrigin(0.5);

      // Agent status text
      const statusText = this.add.text(x, y + 60, this.getAgentStatusText(agent), {
        fontSize: '12px',
        color: '#ffffff'
      }).setOrigin(0.5);
      this.agentTexts.set(agent.id, statusText);

      // Agent stats
      this.add.text(x, y + 80, `Level ${agent.stats.level} | XP: ${agent.stats.experience}`, {
        fontSize: '10px',
        color: '#a0a0a0'
      }).setOrigin(0.5);
    });
  }

  /**
   * Create mission assignment buttons
   */
  private createMissionButtons(): void {
    const startX = this.cameras.main.width / 2;
    const startY = 320;
    const spacing = 60;

    this.missions.forEach((mission, index) => {
      const y = startY + (index * spacing);
      
      const container = this.add.container(startX, y);

      // Button background
      const button = this.add.rectangle(0, 0, 500, 50, 0x0f3460)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.assignMissionToAvailableAgent(mission));

      // Button text
      const text = this.add.text(-240, 0, mission.name, {
        fontSize: '14px',
        color: '#ffffff'
      }).setOrigin(0, 0.5);

      const durationText = this.add.text(240, 0, `${mission.duration / 1000}s`, {
        fontSize: '12px',
        color: '#a0a0a0'
      }).setOrigin(1, 0.5);

      container.add([button, text, durationText]);
      this.missionButtons.push(container);
    });
  }

  /**
   * Assign mission to first available agent
   */
  private assignMissionToAvailableAgent(mission: Mission): void {
    // Find first available agent
    const availableAgent = this.agents.find(agent => agent.isAvailable());

    if (!availableAgent) {
      this.updateStatusText('No agents available! Wait for missions to complete.');
      return;
    }

    if (mission.status !== MissionStatus.PENDING) {
      this.updateStatusText('Mission not available!');
      return;
    }

    // Assign mission
    const success = availableAgent.assignMission(mission);
    if (success) {
      this.updateStatusText(`${availableAgent.name} assigned to ${mission.name}!`);
      this.updateAgentDisplay(availableAgent);
    }
  }

  /**
   * Update all agents
   */
  private updateAgents(): void {
    this.agents.forEach(agent => {
      const previousStatus = agent.status;
      agent.tick();
      
      // Update display if status changed
      if (previousStatus !== agent.status) {
        this.updateAgentDisplay(agent);
        
        if (agent.status === AgentStatus.IDLE) {
          this.updateStatusText(`${agent.name} completed mission!`);
        }
      } else if (agent.status === AgentStatus.ON_MISSION) {
        // Update progress display
        this.updateAgentDisplay(agent);
      }
    });
  }

  /**
   * Update agent visual display
   */
  private updateAgentDisplay(agent: Agent): void {
    const sprite = this.agentSprites.get(agent.id);
    const text = this.agentTexts.get(agent.id);

    if (sprite) {
      // Change color based on status
      if (agent.status === AgentStatus.ON_MISSION) {
        sprite.setFillStyle(0xe94560); // Red when busy
      } else {
        sprite.setFillStyle(this.getAgentColor(agent.type));
      }
    }

    if (text) {
      text.setText(this.getAgentStatusText(agent));
    }
  }

  /**
   * Get agent status text
   */
  private getAgentStatusText(agent: Agent): string {
    if (agent.status === AgentStatus.ON_MISSION && agent.currentMission) {
      return `${Math.floor(agent.currentMission.progress)}% Complete`;
    }
    return agent.status === AgentStatus.IDLE ? 'IDLE' : agent.status.toUpperCase();
  }

  /**
   * Get color for agent type
   */
  private getAgentColor(type: AgentType): number {
    switch (type) {
      case AgentType.SCOUT:
        return 0x4ecca3; // Green
      case AgentType.ENGINEER:
        return 0x3f72af; // Blue
      case AgentType.DIPLOMAT:
        return 0xf9a826; // Orange
      case AgentType.TRADER:
        return 0x9b59b6; // Purple
      default:
        return 0x95a5a6; // Gray
    }
  }

  /**
   * Update status text
   */
  private updateStatusText(message: string): void {
    if (this.statusText) {
      this.statusText.setText(message);
    }
  }

  /**
   * Start network polling for updates
   */
  private startNetworkPolling(): void {
    if (!this.network) return;

    this.network.startPolling((updates) => {
      console.log('Received mission updates:', updates);
      // Handle updates here
      updates.forEach(update => {
        const agent = this.agents.find(a => a.currentMission?.id === update.missionId);
        if (agent && agent.currentMission) {
          agent.currentMission.progress = update.progress;
          this.updateAgentDisplay(agent);
        }
      });
    });
  }

  /**
   * Cleanup on scene shutdown
   */
  shutdown(): void {
    if (this.network) {
      this.network.stopPolling();
    }
  }
}
