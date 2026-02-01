/**
 * Network configuration
 */
export interface NetworkConfig {
  baseUrl: string;
  pollInterval: number; // milliseconds
  timeout: number; // milliseconds
}

/**
 * API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Mission update from server
 */
export interface MissionUpdate {
  missionId: string;
  status: string;
  progress: number;
  timestamp: number;
}

/**
 * Network class
 * Simple TypeScript module for polling a backend API for mission updates
 */
export class Network {
  private config: NetworkConfig;
  private pollTimer?: number;
  private isPolling: boolean = false;

  constructor(config: NetworkConfig) {
    this.config = config;
  }

  /**
   * Perform a GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Perform a POST request
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get mission updates from server
   */
  async getMissionUpdates(): Promise<ApiResponse<MissionUpdate[]>> {
    return this.get<MissionUpdate[]>('/api/missions/updates');
  }

  /**
   * Submit mission assignment to server
   */
  async assignMission(agentId: string, missionId: string): Promise<ApiResponse<any>> {
    return this.post('/api/missions/assign', { agentId, missionId });
  }

  /**
   * Get available missions from server
   */
  async getAvailableMissions(): Promise<ApiResponse<any[]>> {
    return this.get('/api/missions/available');
  }

  /**
   * Get agent status from server
   */
  async getAgentStatus(agentId: string): Promise<ApiResponse<any>> {
    return this.get(`/api/agents/${agentId}`);
  }

  /**
   * Start polling for mission updates
   * @param callback - Function to call with updates
   */
  startPolling(callback: (updates: MissionUpdate[]) => void): void {
    if (this.isPolling) {
      console.warn('Already polling for updates');
      return;
    }

    this.isPolling = true;

    const poll = async () => {
      if (!this.isPolling) return;

      const response = await this.getMissionUpdates();
      if (response.success && response.data) {
        callback(response.data);
      }

      if (this.isPolling) {
        this.pollTimer = setTimeout(poll, this.config.pollInterval) as unknown as number;
      }
    };

    // Start first poll
    poll();
  }

  /**
   * Stop polling for updates
   */
  stopPolling(): void {
    this.isPolling = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  /**
   * Check if currently polling
   */
  getIsPolling(): boolean {
    return this.isPolling;
  }

  /**
   * Update network configuration
   */
  updateConfig(config: Partial<NetworkConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): NetworkConfig {
    return { ...this.config };
  }
}
