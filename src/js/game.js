// Sumikkogurashi Game Engine & Physics Management using Matter.js ("すみっコゲーム")

import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import { SUMIKKO_ITEMS, getRandomSpawnTier } from './sumikko.js';
import { drawSumikko } from './renderer.js';
import { sound } from './audio.js';
import { ParticleSystem } from './particles.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Layout configuration
    this.width = 480;
    this.height = 680;
    this.boxLeft = 30;
    this.boxRight = 450;
    this.boxWidth = 420;
    this.boxBottom = 640;
    this.boxTop = 130;
    this.dangerLineY = 130;
    this.dropY = 75;

    // Matter.js Setup
    this.engine = Matter.Engine.create({
      enableSleeping: false,
    });
    this.engine.gravity.y = 1.35;

    this.particles = new ParticleSystem();

    // Game state variables
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('sumikko_best_score') || '0', 10);
    this.sumikkoMerged = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.canDrop = true;
    this.inDanger = false;
    this.dangerTimer = 0; // seconds spent in danger state

    // Current and Next Dropping Sumikko Items
    this.currentTier = getRandomSpawnTier();
    this.nextTier = getRandomSpawnTier();
    this.pointerX = this.width / 2;

    // Callbacks for UI updates
    this.onScoreUpdate = null;
    this.onNextUpdate = null;
    this.onGameOver = null;

    this.initPhysicsBounds();
    this.initCollisionEvents();
    this.initInputListeners();

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initPhysicsBounds() {
    const wallOptions = {
      isStatic: true,
      restitution: 0.2,
      friction: 0.2,
    };

    // Ground
    const ground = Matter.Bodies.rectangle(
      this.width / 2,
      this.boxBottom + 20,
      this.width,
      40,
      wallOptions
    );

    // Left Wall
    const leftWall = Matter.Bodies.rectangle(
      this.boxLeft - 20,
      this.height / 2,
      40,
      this.height * 2,
      wallOptions
    );

    // Right Wall
    const rightWall = Matter.Bodies.rectangle(
      this.boxRight + 20,
      this.height / 2,
      40,
      this.height * 2,
      wallOptions
    );

    Matter.Composite.add(this.engine.world, [ground, leftWall, rightWall]);
  }

  initCollisionEvents() {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      if (this.isGameOver || this.isPaused) return;

      const pairs = event.pairs;
      const toRemove = [];

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Check if both bodies are sumikko
        if (bodyA.isSumikko && bodyB.isSumikko) {
          if (
            bodyA.sumikkoTier === bodyB.sumikkoTier &&
            !bodyA.isMerged &&
            !bodyB.isMerged
          ) {
            bodyA.isMerged = true;
            bodyB.isMerged = true;

            const tier = bodyA.sumikkoTier;
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            toRemove.push(bodyA, bodyB);

            // Calculate points & update score
            const addedScore = SUMIKKO_ITEMS[tier].score;
            this.addScore(addedScore);
            this.sumikkoMerged++;

            const nextTier = tier + 1;

            if (nextTier < SUMIKKO_ITEMS.length) {
              // Spawn merged higher tier sumikko
              const itemDef = SUMIKKO_ITEMS[nextTier];
              const newBody = Matter.Bodies.circle(midX, midY, itemDef.radius, {
                restitution: 0.25,
                friction: 0.1,
                density: 0.001 * (1 + nextTier * 0.1),
              });

              newBody.isSumikko = true;
              newBody.sumikkoTier = nextTier;
              newBody.isMerged = false;

              Matter.Composite.add(this.engine.world, newBody);

              // Sound & visual effects
              if (nextTier === 10) { // Tokage (Dinosaur)
                sound.playWatermelon(); // Grand fanfare
                confetti({
                  particleCount: 120,
                  spread: 90,
                  origin: { y: 0.6 },
                });
              } else {
                sound.playMerge(nextTier);
              }

              this.particles.spawnMergeBurst(midX, midY, itemDef.color);
              this.particles.spawnScorePopup(midX, midY, addedScore);
            } else {
              // Merge 2 Tokage
              this.addScore(4096);
              sound.playWatermelon();
              confetti({
                particleCount: 200,
                spread: 120,
                origin: { y: 0.5 },
              });
              this.particles.spawnMergeBurst(midX, midY, '#90E0EF', 35);
              this.particles.spawnScorePopup(midX, midY, 4096, '#FFD700');
            }
          }
        }
      }

      for (const body of toRemove) {
        Matter.Composite.remove(this.engine.world, body);
      }
    });
  }

  initInputListeners() {
    const getCanvasPos = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = rect.width ? (this.width / rect.width) : 1;
      return (clientX - rect.left) * scaleX;
    };

    const handlePointerMove = (clientX) => {
      if (this.isGameOver || this.isPaused) return;
      this.updatePointerX(getCanvasPos(clientX));
    };

    const handleActionDrop = (clientX) => {
      if (this.isGameOver || this.isPaused) return;
      sound.init();
      if (clientX !== undefined) {
        this.updatePointerX(getCanvasPos(clientX));
      }
      this.dropCurrentSumikko();
    };

    // Canvas & Container Pointer Events (Unified Mouse / Touch / Pen)
    const container = this.canvas.parentElement || this.canvas;

    container.addEventListener('pointermove', (e) => {
      handlePointerMove(e.clientX);
    });

    container.addEventListener('pointerdown', (e) => {
      handleActionDrop(e.clientX);
    });

    // Touch support fallback
    container.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        handleActionDrop(e.touches[0].clientX);
      }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: false });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (this.isGameOver || this.isPaused) return;
      sound.init();

      const step = 22;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.updatePointerX(this.pointerX - step);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.updatePointerX(this.pointerX + step);
      } else if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.dropCurrentSumikko();
      }
    });
  }

  updatePointerX(x) {
    const currentRadius = SUMIKKO_ITEMS[this.currentTier].radius;
    const minX = this.boxLeft + currentRadius + 5;
    const maxX = this.boxRight - currentRadius - 5;
    this.pointerX = Math.max(minX, Math.min(maxX, x));
  }

  dropCurrentSumikko() {
    if (!this.canDrop || this.isGameOver || this.isPaused) return;

    this.canDrop = false;
    const tier = this.currentTier;
    const itemDef = SUMIKKO_ITEMS[tier];

    // Create physical body
    const body = Matter.Bodies.circle(this.pointerX, this.dropY, itemDef.radius, {
      restitution: 0.2,
      friction: 0.1,
      density: 0.001 * (1 + tier * 0.1),
    });

    body.isSumikko = true;
    body.sumikkoTier = tier;
    body.isMerged = false;

    Matter.Body.setVelocity(body, { x: 0, y: 1.0 });

    Matter.Composite.add(this.engine.world, body);
    sound.playDrop();

    setTimeout(() => {
      if (this.isGameOver) return;
      this.currentTier = this.nextTier;
      this.nextTier = getRandomSpawnTier();
      this.updatePointerX(this.pointerX);
      this.canDrop = true;

      if (this.onNextUpdate) {
        this.onNextUpdate(this.nextTier);
      }
    }, 550);
  }

  addScore(pts) {
    this.score += pts;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('sumikko_best_score', this.bestScore.toString());
    }
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.bestScore);
    }
  }

  checkDangerAndGameOver(delta) {
    const bodies = Matter.Composite.allBodies(this.engine.world);
    let overflow = false;

    for (const body of bodies) {
      if (body.isSumikko && !body.isMerged) {
        const topY = body.position.y - body.circleRadius;
        if (topY <= this.dangerLineY && body.position.y > 0) {
          if (Math.abs(body.velocity.y) < 0.5) {
            overflow = true;
            break;
          }
        }
      }
    }

    if (overflow) {
      this.inDanger = true;
      this.dangerTimer += delta;
      if (this.dangerTimer >= 2.0) {
        this.triggerGameOver();
      }
    } else {
      this.inDanger = false;
      this.dangerTimer = Math.max(0, this.dangerTimer - delta * 2);
    }
  }

  triggerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.canDrop = false;
    sound.playGameOver();

    if (this.onGameOver) {
      this.onGameOver({
        score: this.score,
        bestScore: this.bestScore,
        sumikkoMerged: this.sumikkoMerged,
        isNewRecord: this.score === this.bestScore && this.score > 0,
      });
    }
  }

  restart() {
    const bodies = Matter.Composite.allBodies(this.engine.world);
    for (const b of bodies) {
      if (!b.isStatic) {
        Matter.Composite.remove(this.engine.world, b);
      }
    }

    this.particles.clear();
    this.score = 0;
    this.sumikkoMerged = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.canDrop = true;
    this.inDanger = false;
    this.dangerTimer = 0;

    this.currentTier = getRandomSpawnTier();
    this.nextTier = getRandomSpawnTier();
    this.pointerX = this.width / 2;

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.bestScore);
    }
    if (this.onNextUpdate) {
      this.onNextUpdate(this.nextTier);
    }
  }

  loop(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    if (!this.isPaused && !this.isGameOver) {
      Matter.Engine.update(this.engine, 1000 / 60);
      this.checkDangerAndGameOver(delta);
    }

    this.particles.update();
    this.render();

    requestAnimationFrame(this.loop);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Container Frame
    this.renderContainer(ctx);

    // 2. Render Physics Sumikko Bodies
    const bodies = Matter.Composite.allBodies(this.engine.world);
    for (const body of bodies) {
      if (body.isSumikko) {
        const itemDef = SUMIKKO_ITEMS[body.sumikkoTier];
        drawSumikko(
          ctx,
          body.position.x,
          body.position.y,
          itemDef.radius,
          itemDef,
          body.angle
        );
      }
    }

    // 3. Render Particles & Floating Text
    this.particles.draw(ctx);

    // 4. Render Current Dropping Sumikko Preview & Guide Line
    if (this.canDrop && !this.isGameOver && !this.isPaused) {
      const currentItem = SUMIKKO_ITEMS[this.currentTier];

      // Dotted Trajectory Line
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(this.pointerX, this.dropY);
      ctx.lineTo(this.pointerX, this.boxBottom);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Top Preview Sumikko
      drawSumikko(
        ctx,
        this.pointerX,
        this.dropY,
        currentItem.radius,
        currentItem,
        0,
        true
      );
    }

    // 5. Render Danger Line & Pulsating Glow
    this.renderDangerLine(ctx);
  }

  renderContainer(ctx) {
    ctx.save();

    // Box Background Fill
    const boxGradient = ctx.createLinearGradient(0, this.boxTop, 0, this.boxBottom);
    boxGradient.addColorStop(0, 'rgba(255, 253, 240, 0.45)');
    boxGradient.addColorStop(1, 'rgba(255, 248, 220, 0.65)');

    ctx.fillStyle = boxGradient;
    ctx.fillRect(
      this.boxLeft,
      this.boxTop,
      this.boxWidth,
      this.boxBottom - this.boxTop
    );

    // Box Wooden Side Borders
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#8D5B4C';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(this.boxLeft - 6, this.boxTop - 10);
    ctx.lineTo(this.boxLeft - 6, this.boxBottom + 6);
    ctx.lineTo(this.boxRight + 6, this.boxBottom + 6);
    ctx.lineTo(this.boxRight + 6, this.boxTop - 10);
    ctx.stroke();

    // Inner Glass Outline
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeRect(
      this.boxLeft,
      this.boxTop,
      this.boxWidth,
      this.boxBottom - this.boxTop
    );

    ctx.restore();
  }

  renderDangerLine(ctx) {
    ctx.save();

    const isAlert = this.inDanger;
    const pulse = isAlert ? (Math.sin(performance.now() * 0.01) * 0.5 + 0.5) : 0.4;

    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(this.boxLeft, this.dangerLineY);
    ctx.lineTo(this.boxRight, this.dangerLineY);

    if (isAlert) {
      ctx.strokeStyle = `rgba(255, 50, 50, ${0.6 + pulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 10 * pulse;
    } else {
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
      ctx.lineWidth = 2;
    }

    ctx.stroke();
    ctx.restore();
  }
}
