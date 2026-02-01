/**
 * Core Engine Module
 * 
 * This module provides the core game engine functionality for Pocket Agency.
 * It includes classes for managing agents, missions, progression, and network communication.
 * 
 * @module core-engine
 */

export { Agent, AgentType, AgentStatus, AgentStats } from './Agent.js';
export { Mission, MissionStatus, MissionReward } from './Mission.js';
export { 
  Progression, 
  ProgressionData, 
  UnlockableFeature, 
  UnlockCondition 
} from './Progression.js';
export { 
  Network, 
  NetworkConfig, 
  ApiResponse, 
  MissionUpdate 
} from './Network.js';
