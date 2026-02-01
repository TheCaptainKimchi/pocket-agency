import Phaser from 'phaser';
import { AgencyHubScene } from './scenes/AgencyHubScene';

/**
 * Phaser game configuration
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#16213e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [AgencyHubScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

/**
 * Initialize and start the game
 */
window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
  
  // Expose game instance for debugging
  (window as any).game = game;
  
  console.log('Pocket Agency - Game Started');
});
