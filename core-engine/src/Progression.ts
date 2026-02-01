import { Agent, AgentType } from './Agent';

/**
 * Feature unlock conditions
 */
export interface UnlockCondition {
  type: 'level' | 'missions' | 'agent_count';
  value: number;
}

/**
 * Unlockable feature definition
 */
export interface UnlockableFeature {
  id: string;
  name: string;
  description: string;
  condition: UnlockCondition;
  unlocked: boolean;
}

/**
 * Player progression data
 */
export interface ProgressionData {
  playerLevel: number;
  totalExperience: number;
  totalMissions: number;
  agentCount: number;
  unlockedFeatures: string[];
}

/**
 * Progression class
 * Handles player progression, feature unlocking, and game state
 */
export class Progression {
  private data: ProgressionData;
  private features: Map<string, UnlockableFeature>;
  private agents: Map<string, Agent>;

  constructor() {
    this.data = {
      playerLevel: 1,
      totalExperience: 0,
      totalMissions: 0,
      agentCount: 0,
      unlockedFeatures: []
    };
    this.features = new Map();
    this.agents = new Map();
    
    // Initialize default unlockable features
    this.initializeDefaultFeatures();
  }

  /**
   * Initialize default unlockable features
   */
  private initializeDefaultFeatures(): void {
    const defaultFeatures: UnlockableFeature[] = [
      {
        id: 'second_agent',
        name: 'Second Agent Slot',
        description: 'Unlock a second agent slot',
        condition: { type: 'missions', value: 5 },
        unlocked: false
      },
      {
        id: 'third_agent',
        name: 'Third Agent Slot',
        description: 'Unlock a third agent slot',
        condition: { type: 'missions', value: 15 },
        unlocked: false
      },
      {
        id: 'advanced_missions',
        name: 'Advanced Missions',
        description: 'Unlock access to advanced missions',
        condition: { type: 'level', value: 5 },
        unlocked: false
      },
      {
        id: 'agent_specialization',
        name: 'Agent Specialization',
        description: 'Unlock ability to specialize agents',
        condition: { type: 'level', value: 10 },
        unlocked: false
      }
    ];

    defaultFeatures.forEach(feature => {
      this.features.set(feature.id, feature);
    });
  }

  /**
   * Register an agent with the progression system
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.data.agentCount = this.agents.size;
    this.checkUnlocks();
  }

  /**
   * Update progression when a mission is completed
   */
  onMissionComplete(experience: number): void {
    this.data.totalMissions++;
    this.data.totalExperience += experience;
    
    // Check for player level up
    this.updatePlayerLevel();
    
    // Check for feature unlocks
    this.checkUnlocks();
  }

  /**
   * Update player level based on total experience
   */
  private updatePlayerLevel(): void {
    const newLevel = Math.floor(this.data.totalExperience / 500) + 1;
    if (newLevel > this.data.playerLevel) {
      this.data.playerLevel = newLevel;
      console.log(`Player level up! Now level ${this.data.playerLevel}`);
    }
  }

  /**
   * Check all features for unlock conditions
   */
  private checkUnlocks(): void {
    this.features.forEach((feature, id) => {
      if (!feature.unlocked && this.checkUnlockCondition(feature.condition)) {
        this.unlockFeature(id);
      }
    });
  }

  /**
   * Check if a specific unlock condition is met
   */
  private checkUnlockCondition(condition: UnlockCondition): boolean {
    switch (condition.type) {
      case 'level':
        return this.data.playerLevel >= condition.value;
      case 'missions':
        return this.data.totalMissions >= condition.value;
      case 'agent_count':
        return this.data.agentCount >= condition.value;
      default:
        return false;
    }
  }

  /**
   * Unlock a feature
   */
  private unlockFeature(featureId: string): void {
    const feature = this.features.get(featureId);
    if (feature && !feature.unlocked) {
      feature.unlocked = true;
      this.data.unlockedFeatures.push(featureId);
      console.log(`Feature unlocked: ${feature.name}`);
    }
  }

  /**
   * Check if a feature is unlocked
   */
  isFeatureUnlocked(featureId: string): boolean {
    const feature = this.features.get(featureId);
    return feature ? feature.unlocked : false;
  }

  /**
   * Get all unlockable features
   */
  getAllFeatures(): UnlockableFeature[] {
    return Array.from(this.features.values());
  }

  /**
   * Get locked features
   */
  getLockedFeatures(): UnlockableFeature[] {
    return Array.from(this.features.values()).filter(f => !f.unlocked);
  }

  /**
   * Get unlocked features
   */
  getUnlockedFeatures(): UnlockableFeature[] {
    return Array.from(this.features.values()).filter(f => f.unlocked);
  }

  /**
   * Get current progression data
   */
  getData(): ProgressionData {
    return { ...this.data };
  }

  /**
   * Calculate maximum number of allowed agents based on unlocks
   */
  getMaxAgents(): number {
    let max = 1; // Start with 1 agent
    if (this.isFeatureUnlocked('second_agent')) max++;
    if (this.isFeatureUnlocked('third_agent')) max++;
    return max;
  }

  /**
   * Export progression state to JSON
   */
  toJSON(): object {
    return {
      data: this.data,
      features: Array.from(this.features.values())
    };
  }

  /**
   * Import progression state from JSON
   */
  fromJSON(json: any): void {
    if (json.data) {
      this.data = json.data;
    }
    if (json.features && Array.isArray(json.features)) {
      json.features.forEach((feature: UnlockableFeature) => {
        this.features.set(feature.id, feature);
      });
    }
  }
}
