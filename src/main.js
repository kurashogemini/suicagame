import './style.css';
import { GameEngine } from './js/game.js';
import { UIController } from './js/ui.js';

function init() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  const game = new GameEngine(canvas);
  const ui = new UIController(game);

  window.animalGame = game;
  window.animalUI = ui;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
