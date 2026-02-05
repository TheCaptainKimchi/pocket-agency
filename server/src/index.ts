import express, { Request, Response } from 'express';
import cors from 'cors';
import { Mission, MissionStatus, Agent, AgentType } from 'core-engine';

/**
 * Pocket Agency Server
 * 
 * This is a placeholder backend server for handling agent missions.
 * It provides REST API endpoints for the web and mobile clients.
 */

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const missions: Map<string, Mission> = new Map();
const agents: Map<string, Agent> = new Map();

// Initialize sample data
function initializeSampleData() {
  // Create sample missions
  const sampleMissions = [
    new Mission('mission-1', 'Resource Survey', 'Survey nearby area', 15000, { experience: 50 }),
    new Mission('mission-2', 'Build Prototype', 'Construct device', 25000, { experience: 75 }),
    new Mission('mission-3', 'Negotiate Trade', 'Establish trade', 20000, { experience: 60 })
  ];

  sampleMissions.forEach(mission => missions.set(mission.id, mission));

  // Create sample agents
  const sampleAgents = [
    new Agent('agent-1', 'Scout Alpha', AgentType.SCOUT),
    new Agent('agent-2', 'Engineer Beta', AgentType.ENGINEER),
    new Agent('agent-3', 'Diplomat Gamma', AgentType.DIPLOMAT)
  ];

  sampleAgents.forEach(agent => agents.set(agent.id, agent));

  console.log('Sample data initialized');
}

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

/**
 * Get all available missions
 */
app.get('/api/missions/available', (req: Request, res: Response) => {
  const availableMissions = Array.from(missions.values())
    .filter(m => m.status === MissionStatus.PENDING)
    .map(m => m.toJSON());

  res.json(availableMissions);
});

/**
 * Get mission updates
 */
app.get('/api/missions/updates', (req: Request, res: Response) => {
  const updates = Array.from(missions.values())
    .filter(m => m.status === MissionStatus.IN_PROGRESS)
    .map(m => ({
      missionId: m.id,
      status: m.status,
      progress: m.progress,
      timestamp: Date.now()
    }));

  res.json(updates);
});

/**
 * Assign mission to agent
 */
app.post('/api/missions/assign', (req: Request, res: Response) => {
  const { agentId, missionId } = req.body;

  if (!agentId || !missionId) {
    return res.status(400).json({ error: 'agentId and missionId are required' });
  }

  const agent = agents.get(agentId);
  const mission = missions.get(missionId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  if (!mission) {
    return res.status(404).json({ error: 'Mission not found' });
  }

  const success = agent.assignMission(mission);

  if (success) {
    res.json({
      success: true,
      message: `Mission ${mission.name} assigned to ${agent.name}`,
      agent: agent.toJSON(),
      mission: mission.toJSON()
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Failed to assign mission'
    });
  }
});

/**
 * Get agent status
 */
app.get('/api/agents/:agentId', (req: Request, res: Response) => {
  const { agentId } = req.params;
  const agent = agents.get(agentId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json(agent.toJSON());
});

/**
 * Get all agents
 */
app.get('/api/agents', (req: Request, res: Response) => {
  const allAgents = Array.from(agents.values()).map(a => a.toJSON());
  res.json(allAgents);
});

/**
 * Update loop to tick missions and agents
 */
function updateLoop() {
  agents.forEach(agent => agent.tick());
  missions.forEach(mission => mission.tick());
}

// Start server
app.listen(PORT, () => {
  console.log(`Pocket Agency Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  initializeSampleData();
  
  // Start update loop
  setInterval(updateLoop, 100); // Update every 100ms
});

export default app;
