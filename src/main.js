import './style.css';
import { GameEngine } from './js/game.js';
import { UIController } from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  const game = new GameEngine(canvas);
  const ui = new UIController(game);

  window.suicaGame = game;
  window.suicaUI = ui;
});
