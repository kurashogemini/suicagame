// Suika Game Engine & Physics Management using Matter.js

import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import { FRUITS, getRandomSpawnTier } from './fruits.js';
import { drawFruit } from './renderer.js';
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
    this.bestScore = parseInt(localStorage.getItem('suica_best_score') || '0', 10);
    this.fruitsMerged = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.canDrop = true;
    this.inDanger = false;
    this.dangerTimer = 0; // seconds spent in danger state

    // Current and Next Dropping Fruits
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

        // Check if both bodies are fruits
        if (bodyA.isFruit && bodyB.isFruit) {
          if (
            bodyA.fruitTier === bodyB.fruitTier &&
            !bodyA.isMerged &&
            !bodyB.isMerged
          ) {
            // Mark merged to prevent double handling in same frame
            bodyA.isMerged = true;
            bodyB.isMerged = true;

            const tier = bodyA.fruitTier;
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            toRemove.push(bodyA, bodyB);

            // Calculate points & update score
            const addedScore = FRUITS[tier].score;
            this.addScore(addedScore);
            this.fruitsMerged++;

            const nextTier = tier + 1;

            if (nextTier < FRUITS.length) {
              // Spawn merged higher tier fruit
              const fruitDef = FRUITS[nextTier];
              const newBody = Matter.Bodies.circle(midX, midY, fruitDef.radius, {
                restitution: 0.25,
                friction: 0.1,
                density: 0.001 * (1 + nextTier * 0.1),
              });

              newBody.isFruit = true;
              newBody.fruitTier = nextTier;
              newBody.isMerged = false;

              Matter.Composite.add(this.engine.world, newBody);

              // Sound & visual effects
              if (nextTier === 10) { // Watermelon
                sound.playWatermelon();
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } else {
                sound.playMerge(nextTier);
              }

              this.particles.spawnMergeBurst(midX, midY, fruitDef.color);
              this.particles.spawnScorePopup(midX, midY, addedScore);
            } else {
              // Merge 2 Watermelons (Double Suika)
              this.addScore(4096);
              sound.playWatermelon();
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
              });
              this.particles.spawnMergeBurst(midX, midY, '#2B9348', 25);
              this.particles.spawnScorePopup(midX, midY, 4096, '#FFD700');
            }
          }
        }
      }

      // Remove merged bodies from world
      for (const body of toRemove) {
        Matter.Composite.remove(this.engine.world, body);
      }
    });
  }

  initInputListeners() {
    const getCanvasPos = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      return (clientX - rect.left) * scaleX;
    };

    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isGameOver || this.isPaused) return;
      this.updatePointerX(getCanvasPos(e.clientX));
    });

    // Mouse click drop
    this.canvas.addEventListener('click', (e) => {
      if (this.isGameOver || this.isPaused) return;
      this.dropCurrentFruit();
    });

    // Touch support
    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isGameOver || this.isPaused || !e.touches[0]) return;
      e.preventDefault();
      this.updatePointerX(getCanvasPos(e.touches[0].clientX));
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.isGameOver || this.isPaused) return;
      this.dropCurrentFruit();
    });

    // Keyboard support (Left/Right arrows to move, Space/Down to drop)
    window.addEventListener('keydown', (e) => {
      if (this.isGameOver || this.isPaused) return;

      const step = 20;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.updatePointerX(this.pointerX - step);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.updatePointerX(this.pointerX + step);
      } else if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.dropCurrentFruit();
      }
    });
  }

  updatePointerX(x) {
    const currentRadius = FRUITS[this.currentTier].radius;
    const minX = this.boxLeft + currentRadius + 5;
    const maxX = this.boxRight - currentRadius - 5;
    this.pointerX = Math.max(minX, Math.min(maxX, x));
  }

  dropCurrentFruit() {
    if (!this.canDrop || this.isGameOver || this.isPaused) return;

    this.canDrop = false;
    const tier = this.currentTier;
    const fruitDef = FRUITS[tier];

    // Create physical body
    const body = Matter.Bodies.circle(this.pointerX, this.dropY, fruitDef.radius, {
      restitution: 0.2,
      friction: 0.1,
      density: 0.001 * (1 + tier * 0.1),
    });

    body.isFruit = true;
    body.fruitTier = tier;
    body.isMerged = false;
    // Slight downward nudge
    Matter.Body.setVelocity(body, { x: 0, y: 1.0 });

    Matter.Composite.add(this.engine.world, body);
    sound.playDrop();

    // Cooldown before next fruit drop
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
      localStorage.setItem('suica_best_score', this.bestScore.toString());
    }
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.bestScore);
    }
  }

  checkDangerAndGameOver(delta) {
    const bodies = Matter.Composite.allBodies(this.engine.world);
    let overflow = false;

    for (const body of bodies) {
      if (body.isFruit && !body.isMerged) {
        // If fruit top crosses danger line and body is not moving rapidly downwards
        const topY = body.position.y - body.circleRadius;
        if (topY <= this.dangerLineY && body.position.y > 0) {
          // Check if body is settled or moving slowly
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
      if (this.dangerTimer >= 2.0) { // 2 seconds over danger line = Game Over
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
        fruitsMerged: this.fruitsMerged,
        isNewRecord: this.score === this.bestScore && this.score > 0,
      });
    }
  }

  restart() {
    // Clear all bodies except walls
    const bodies = Matter.Composite.allBodies(this.engine.world);
    for (const b of bodies) {
      if (!b.isStatic) {
        Matter.Composite.remove(this.engine.world, b);
      }
    }

    this.particles.clear();
    this.score = 0;
    this.fruitsMerged = 0;
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
    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;

    if (!this.isPaused && !this.isGameOver) {
      // Advance physics engine
      Matter.Engine.update(this.engine, Math.min(delta * 1000, 30));
      this.checkDangerAndGameOver(delta);
    }

    this.particles.update();
    this.render();

    requestAnimationFrame(this.loop);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Glass Box Container
    this.renderContainer(ctx);

    // 2. Render Physics Fruit Bodies
    const bodies = Matter.Composite.allBodies(this.engine.world);
    for (const body of bodies) {
      if (body.isFruit) {
        const fruitDef = FRUITS[body.fruitTier];
        drawFruit(
          ctx,
          body.position.x,
          body.position.y,
          fruitDef.radius,
          fruitDef,
          body.angle
        );
      }
    }

    // 3. Render Particles & Floating Text
    this.particles.draw(ctx);

    // 4. Render Current Drop Fruit Preview & Trajectory Line (if active & can drop)
    if (this.canDrop && !this.isGameOver && !this.isPaused) {
      const currentFruit = FRUITS[this.currentTier];

      // Dotted Trajectory Guide Line
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(this.pointerX, this.dropY);
      ctx.lineTo(this.pointerX, this.boxBottom);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Top Ready Fruit
      drawFruit(
        ctx,
        this.pointerX,
        this.dropY,
        currentFruit.radius,
        currentFruit,
        0,
        true
      );
    }

    // 5. Render Danger Line & Warning Glow
    this.renderDangerLine(ctx);
  }

  renderContainer(ctx) {
    ctx.save();

    // Box Background Fill (Soft warm container gradient)
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
    // Left border
    ctx.moveTo(this.boxLeft - 6, this.boxTop - 10);
    ctx.lineTo(this.boxLeft - 6, this.boxBottom + 6);
    // Bottom border
    ctx.lineTo(this.boxRight + 6, this.boxBottom + 6);
    // Right border
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
