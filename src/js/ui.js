// UI Controller for "すしころ回転祭" (Sushi Express)

import { SUSHI_ITEMS } from './sushi.js';
import { drawSushi } from './renderer.js';
import { sound } from './audio.js';

export class UIController {
  constructor(gameEngine) {
    this.game = gameEngine;

    // Elements
    this.scoreValEl = document.getElementById('score-val');
    this.bestScoreValEl = document.getElementById('best-score-val');
    this.nextCanvasEl = document.getElementById('next-canvas');
    this.nextCtx = this.nextCanvasEl ? this.nextCanvasEl.getContext('2d') : null;

    this.evolutionContainer = document.getElementById('evolution-chart');

    // Modals
    this.gameOverModal = document.getElementById('game-over-modal');
    this.finalScoreEl = document.getElementById('final-score');
    this.finalBestEl = document.getElementById('final-best');
    this.finalMergedEl = document.getElementById('final-merged');
    this.newRecordBadge = document.getElementById('new-record-badge');
    this.retryBtn = document.getElementById('retry-btn');

    this.howToPlayModal = document.getElementById('how-to-play-modal');
    this.howToPlayBtn = document.getElementById('how-to-play-btn');
    this.closeHowToBtn = document.getElementById('close-how-to-btn');

    this.restartBtn = document.getElementById('restart-btn');
    this.soundBtn = document.getElementById('sound-btn');
    this.soundIcon = document.getElementById('sound-icon');

    this.initEvolutionChart();
    this.bindEvents();
    this.updateSoundIcon();

    // Hook game callbacks
    this.game.onScoreUpdate = (score, bestScore) => {
      this.updateScore(score, bestScore);
    };

    this.game.onNextUpdate = (nextTier) => {
      this.renderNextPreview(nextTier);
    };

    this.game.onGameOver = (stats) => {
      this.showGameOver(stats);
    };

    // Initial render
    this.updateScore(this.game.score, this.game.bestScore);
    this.renderNextPreview(this.game.nextTier);
  }

  initEvolutionChart() {
    if (!this.evolutionContainer) return;
    this.evolutionContainer.innerHTML = '';

    SUSHI_ITEMS.forEach((item, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'evolution-item';
      itemEl.title = `${item.nameJa} (${item.name}) - ${item.score}pt`;

      const canvas = document.createElement('canvas');
      canvas.width = 44;
      canvas.height = 44;
      const ctx = canvas.getContext('2d');

      const scaleRadius = Math.min(18, 8 + idx * 1.1);
      drawSushi(ctx, 22, 22, scaleRadius, item, 0, true);

      const label = document.createElement('span');
      label.className = 'evolution-label';
      label.textContent = `${idx + 1}`;

      itemEl.appendChild(canvas);
      itemEl.appendChild(label);
      this.evolutionContainer.appendChild(itemEl);

      if (idx < SUSHI_ITEMS.length - 1) {
        const arrow = document.createElement('span');
        arrow.className = 'evolution-arrow';
        arrow.textContent = '➔';
        this.evolutionContainer.appendChild(arrow);
      }
    });
  }

  updateScore(score, bestScore) {
    if (this.scoreValEl) {
      this.scoreValEl.textContent = score.toLocaleString();
    }
    if (this.bestScoreValEl) {
      this.bestScoreValEl.textContent = bestScore.toLocaleString();
    }
  }

  renderNextPreview(tier) {
    if (!this.nextCtx) return;
    const w = this.nextCanvasEl.width;
    const h = this.nextCanvasEl.height;
    this.nextCtx.clearRect(0, 0, w, h);

    const itemDef = SUSHI_ITEMS[tier];
    const radius = Math.min(22, itemDef.radius * 0.75);
    drawSushi(this.nextCtx, w / 2, h / 2, radius, itemDef, 0, true);
  }

  showGameOver(stats) {
    if (this.finalScoreEl) this.finalScoreEl.textContent = stats.score.toLocaleString();
    if (this.finalBestEl) this.finalBestEl.textContent = stats.bestScore.toLocaleString();
    if (this.finalMergedEl) this.finalMergedEl.textContent = (stats.sushiMerged || 0).toString();

    if (this.newRecordBadge) {
      this.newRecordBadge.style.display = stats.isNewRecord ? 'inline-block' : 'none';
    }

    if (this.gameOverModal) {
      this.gameOverModal.classList.add('active');
    }
  }

  hideGameOver() {
    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('active');
    }
  }

  updateSoundIcon() {
    if (!this.soundIcon) return;
    const isMuted = sound.isMuted();
    this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
  }

  bindEvents() {

    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => {
        sound.playClick();
        this.hideGameOver();
        this.game.restart();
      });
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        sound.playClick();
        this.hideGameOver();
        this.game.restart();
      });
    }

    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        sound.toggleMute();
        sound.playClick();
        this.updateSoundIcon();
      });
    }

    if (this.howToPlayBtn) {
      this.howToPlayBtn.addEventListener('click', () => {
        sound.playClick();
        if (this.howToPlayModal) this.howToPlayModal.classList.add('active');
      });
    }

    if (this.closeHowToBtn) {
      this.closeHowToBtn.addEventListener('click', () => {
        sound.playClick();
        if (this.howToPlayModal) this.howToPlayModal.classList.remove('active');
      });
    }
  }
}
