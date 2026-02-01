import { Mission, MissionStatus } from './Mission.js';

/**
 * Agent type enumeration
 * Defines different types of agents with different capabilities
 */
export enum AgentType {
  SCOUT = 'scout',
  ENGINEER = 'engineer',
  DIPLOMAT = 'diplomat',
  TRADER = 'trader'
}

/**
 * Agent status enumeration
 * Represents the current state of an agent
 */
export enum AgentStatus {
  IDLE = 'idle',
  ON_MISSION = 'on_mission',
  RESTING = 'resting',
  UNAVAILABLE = 'unavailable'
}

/**
 * Agent statistics
 */
export interface AgentStats {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  missionsCompleted: number;
}

/**
 * Agent class
 * Represents an AI agent that can perform missions
 */
export class Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  stats: AgentStats;
  currentMission?: Mission;
  missionHistory: string[]; // Array of mission IDs

  constructor(
    id: string,
    name: string,
    type: AgentType,
    initialLevel: number = 1
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = AgentStatus.IDLE;
    this.stats = {
      level: initialLevel,
      experience: 0,
      experienceToNextLevel: this.calculateExperienceForNextLevel(initialLevel),
      missionsCompleted: 0
    };
    this.missionHistory = [];
  }

  /**
   * Calculate experience required for next level
   */
  private calculateExperienceForNextLevel(level: number): number {
    return level * 100; // Simple formula: 100 XP per level
  }

  /**
   * Assign a mission to this agent
   * @param mission - The mission to assign
   * @returns true if mission was assigned successfully
   */
  assignMission(mission: Mission): boolean {
    if (this.status !== AgentStatus.IDLE) {
      console.warn(`Agent ${this.name} is not idle and cannot accept mission`);
      return false;
    }

    if (mission.status !== MissionStatus.PENDING) {
      console.warn(`Mission ${mission.name} is not available`);
      return false;
    }

    this.currentMission = mission;
    this.status = AgentStatus.ON_MISSION;
    mission.start(this.id);
    return true;
  }

  /**
   * Update agent state - should be called periodically
   * Updates current mission progress and checks for completion
   */
  tick(): void {
    if (this.status === AgentStatus.ON_MISSION && this.currentMission) {
      this.currentMission.tick();

      if (this.currentMission.status === MissionStatus.COMPLETED) {
        this.completeMission();
      } else if (this.currentMission.status === MissionStatus.FAILED) {
        this.failMission();
      }
    }
  }

  /**
   * Handle mission completion
   */
  private completeMission(): void {
    if (!this.currentMission) return;

    // Add experience
    this.gainExperience(this.currentMission.reward.experience);

    // Update statistics
    this.stats.missionsCompleted++;
    this.missionHistory.push(this.currentMission.id);

    // Clear current mission and return to idle
    this.currentMission = undefined;
    this.status = AgentStatus.IDLE;
  }

  /**
   * Handle mission failure
   */
  private failMission(): void {
    if (!this.currentMission) return;

    this.missionHistory.push(this.currentMission.id);
    this.currentMission = undefined;
    this.status = AgentStatus.IDLE;
  }

  /**
   * Add experience to the agent and handle level ups
   */
  gainExperience(amount: number): void {
    this.stats.experience += amount;

    // Check for level up
    while (this.stats.experience >= this.stats.experienceToNextLevel) {
      this.levelUp();
    }
  }

  /**
   * Level up the agent
   */
  private levelUp(): void {
    this.stats.level++;
    this.stats.experience -= this.stats.experienceToNextLevel;
    this.stats.experienceToNextLevel = this.calculateExperienceForNextLevel(this.stats.level);
    console.log(`Agent ${this.name} leveled up to level ${this.stats.level}!`);
  }

  /**
   * Cancel current mission
   */
  cancelMission(): boolean {
    if (this.status !== AgentStatus.ON_MISSION || !this.currentMission) {
      return false;
    }

    this.currentMission.cancel();
    this.currentMission = undefined;
    this.status = AgentStatus.IDLE;
    return true;
  }

  /**
   * Check if agent is available for missions
   */
  isAvailable(): boolean {
    return this.status === AgentStatus.IDLE;
  }

  /**
   * Serialize agent to JSON
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      stats: this.stats,
      currentMission: this.currentMission?.toJSON(),
      missionHistory: this.missionHistory
    };
  }
}
