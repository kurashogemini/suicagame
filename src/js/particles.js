// Particle and FX System for Suika Game

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.scorePopups = [];
  }

  // Create burst of star/circle sparkles at position
  spawnMergeBurst(x, y, color, count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4.5;
      const size = 3 + Math.random() * 5;
      const lifetime = 25 + Math.random() * 20;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // slight upward bias
        size,
        color,
        alpha: 1,
        life: 0,
        maxLife: lifetime,
        type: Math.random() > 0.4 ? 'star' : 'circle',
      });
    }
  }

  // Floating text popups like "+64"
  spawnScorePopup(x, y, text, color = '#FFD700') {
    this.scorePopups.push({
      x,
      y,
      text: String(text),
      color,
      alpha: 1.0,
      scale: 1.4,
      vy: -1.8,
      life: 0,
      maxLife: 45,
    });
  }

  update() {
    // Update particle positions and alpha
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // slight gravity
      p.vx *= 0.96;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating text popups
    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const sp = this.scorePopups[i];
      sp.y += sp.vy;
      sp.vy *= 0.95;
      sp.life++;
      sp.alpha = Math.max(0, 1 - sp.life / sp.maxLife);
      if (sp.life < 10) {
        sp.scale = 1 + (10 - sp.life) * 0.04;
      } else {
        sp.scale = 1.0;
      }

      if (sp.life >= sp.maxLife) {
        this.scorePopups.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Draw particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.type === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw star sparkle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.life * 0.1));
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(p.size * 0.3, p.size * 0.3);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw score text popups
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const sp of this.scorePopups) {
      ctx.globalAlpha = Math.max(0, sp.alpha);
      ctx.font = `900 ${Math.round(20 * sp.scale)}px "M PLUS Rounded 1c", "Fredoka", sans-serif`;

      // Text stroke shadow for contrast
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(`+${sp.text}`, sp.x, sp.y);

      ctx.fillStyle = sp.color;
      ctx.fillText(`+${sp.text}`, sp.x, sp.y);
    }

    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.scorePopups = [];
  }
}
