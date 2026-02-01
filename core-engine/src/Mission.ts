/**
 * Mission status enumeration
 * Represents the current state of a mission
 */
export enum MissionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Reward structure for completed missions
 */
export interface MissionReward {
  experience: number;
  currency?: number;
  items?: string[];
}

/**
 * Mission class
 * Represents an asynchronous task that agents can perform
 */
export class Mission {
  id: string;
  name: string;
  description: string;
  duration: number; // in milliseconds
  status: MissionStatus;
  progress: number; // 0-100
  reward: MissionReward;
  startTime?: number;
  assignedAgentId?: string;

  constructor(
    id: string,
    name: string,
    description: string,
    duration: number,
    reward: MissionReward
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.status = MissionStatus.PENDING;
    this.progress = 0;
    this.reward = reward;
  }

  /**
   * Start the mission
   * @param agentId - The ID of the agent assigned to this mission
   */
  start(agentId: string): void {
    if (this.status === MissionStatus.PENDING) {
      this.status = MissionStatus.IN_PROGRESS;
      this.startTime = Date.now();
      this.assignedAgentId = agentId;
      this.progress = 0;
    }
  }

  /**
   * Update mission progress based on elapsed time
   * Should be called periodically to update mission state
   */
  tick(): void {
    if (this.status !== MissionStatus.IN_PROGRESS || !this.startTime) {
      return;
    }

    const elapsed = Date.now() - this.startTime;
    this.progress = Math.min(100, (elapsed / this.duration) * 100);

    if (this.progress >= 100) {
      this.complete();
    }
  }

  /**
   * Mark the mission as completed
   */
  complete(): void {
    this.status = MissionStatus.COMPLETED;
    this.progress = 100;
  }

  /**
   * Mark the mission as failed
   */
  fail(): void {
    this.status = MissionStatus.FAILED;
  }

  /**
   * Cancel the mission and reset to pending
   */
  cancel(): void {
    this.status = MissionStatus.PENDING;
    this.progress = 0;
    this.startTime = undefined;
    this.assignedAgentId = undefined;
  }

  /**
   * Get remaining time in milliseconds
   */
  getRemainingTime(): number {
    if (this.status !== MissionStatus.IN_PROGRESS || !this.startTime) {
      return this.duration;
    }

    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.duration - elapsed);
  }

  /**
   * Serialize mission to JSON
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      duration: this.duration,
      status: this.status,
      progress: this.progress,
      reward: this.reward,
      startTime: this.startTime,
      assignedAgentId: this.assignedAgentId,
      remainingTime: this.getRemainingTime()
    };
  }
}
