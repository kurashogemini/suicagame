// Visual Canvas Renderer for Sushi Items & Environment ("すしころ回転祭")

import { SUSHI_ITEMS } from './sushi.js';

export function drawSushi(ctx, x, y, radius, itemDef, angle = 0, isPreview = false) {
  ctx.save();
  ctx.translate(x, y);

  if (!isPreview) {
    ctx.rotate(angle);
  }

  // Soft drop shadow
  if (!isPreview) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(2, 4, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
    ctx.fill();
    ctx.restore();
  }

  // Rice Shari / Nori Base
  drawSushiBase(ctx, radius, itemDef);

  // Main Item Body Fill
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);

  const gradient = ctx.createRadialGradient(
    -radius * 0.3,
    -radius * 0.3,
    radius * 0.1,
    0,
    0,
    radius
  );
  gradient.addColorStop(0, itemDef.gradientColor || itemDef.color);
  gradient.addColorStop(0.85, itemDef.color);
  gradient.addColorStop(1, itemDef.accentColor);

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.lineWidth = Math.max(2, radius * 0.04);
  ctx.strokeStyle = itemDef.accentColor;
  ctx.stroke();

  // Unique sushi details (Seaweed belt, Salmon stripes, Ikura pearls, Chirashi toppings)
  drawSushiDetails(ctx, radius, itemDef);

  // Cute face (eyes, blush, smile)
  drawSushiFace(ctx, radius, itemDef);

  // Glossy highlight
  ctx.beginPath();
  ctx.ellipse(
    -radius * 0.35,
    -radius * 0.35,
    radius * 0.25,
    radius * 0.15,
    -Math.PI / 4,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();

  ctx.restore();
}

function drawSushiBase(ctx, r, item) {
  ctx.save();

  // Draw White Rice / Black Nori Underlayer based on type
  if (item.type === 'kanpyo' || item.type === 'ikura' || item.type === 'uni') {
    // Dark Nori Wrapper Border
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
    ctx.fillStyle = '#1D2A26';
    ctx.fill();
  } else if (item.type === 'chirashi') {
    // Golden Bowl Rim
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = '#6A040F';
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = Math.max(3, r * 0.06);
    ctx.stroke();
  } else {
    // White Rice Cushion Base at bottom of Nigiri
    ctx.beginPath();
    ctx.arc(0, r * 0.15, r * 0.9, 0, Math.PI);
    ctx.fillStyle = '#FAF9F6';
    ctx.fill();
    ctx.strokeStyle = '#E2E2E2';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

function drawSushiDetails(ctx, r, item) {
  ctx.save();

  switch (item.type) {
    case 'tamago':
      // Black Seaweed Nori Belt in middle
      ctx.fillStyle = '#1D2A26';
      ctx.beginPath();
      ctx.rect(-r * 0.22, -r * 0.95, r * 0.44, r * 1.9);
      ctx.fill();
      break;

    case 'kanpyo':
      // White rice ring + Kanpyo core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
      ctx.fill();

      // Kanpyo brown center
      ctx.fillStyle = '#4A2810';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'inari':
      // Tofu pouch texture lines
      ctx.strokeStyle = 'rgba(100, 50, 0, 0.25)';
      ctx.lineWidth = Math.max(2, r * 0.05);
      for (let i = -r * 0.6; i <= r * 0.6; i += r * 0.3) {
        ctx.beginPath();
        ctx.moveTo(i, -r * 0.7);
        ctx.lineTo(i, r * 0.7);
        ctx.stroke();
      }
      break;

    case 'ebi':
      // Shrimp Tail on top
      ctx.fillStyle = '#E76F51';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.lineTo(-r * 0.3, -r * 1.25);
      ctx.lineTo(0, -r * 1.05);
      ctx.lineTo(r * 0.3, -r * 1.25);
      ctx.closePath();
      ctx.fill();

      // White stripe markings
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(2, r * 0.05);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      break;

    case 'ika':
      // Diagonal scored cuts
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = Math.max(1.5, r * 0.04);
      for (let i = -r * 0.5; i <= r * 0.5; i += r * 0.25) {
        ctx.beginPath();
        ctx.moveTo(i - r * 0.2, -r * 0.5);
        ctx.lineTo(i + r * 0.2, r * 0.5);
        ctx.stroke();
      }
      break;

    case 'salmon':
      // Salmon white marbling stripes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = Math.max(2, r * 0.06);
      const angles = [-0.4, -0.1, 0.2, 0.5];
      angles.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(-r * 0.8, a * r);
        ctx.quadraticCurveTo(0, (a + 0.15) * r, r * 0.8, a * r);
        ctx.stroke();
      });
      break;

    case 'maguro':
      // Fine deep red grain lines
      ctx.strokeStyle = 'rgba(120, 0, 15, 0.4)';
      ctx.lineWidth = Math.max(1.5, r * 0.04);
      for (let i = -r * 0.5; i <= r * 0.5; i += r * 0.3) {
        ctx.beginPath();
        ctx.moveTo(-r * 0.7, i);
        ctx.lineTo(r * 0.7, i);
        ctx.stroke();
      }
      break;

    case 'ikura':
      // Glowing Salmon Roe Pearls
      const roeCoords = [
        [0, -0.3], [-0.35, -0.2], [0.35, -0.2],
        [-0.4, 0.25], [0.4, 0.25], [0, 0.35], [-0.18, 0.05], [0.18, 0.05]
      ];
      roeCoords.forEach(([rx, ry]) => {
        const roeR = r * 0.16;
        ctx.beginPath();
        ctx.arc(rx * r, ry * r, roeR, 0, Math.PI * 2);
        ctx.fillStyle = '#FF5722';
        ctx.fill();
        ctx.strokeStyle = '#E64A19';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pearl shine dot
        ctx.beginPath();
        ctx.arc(rx * r - roeR * 0.3, ry * r - roeR * 0.3, roeR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });
      break;

    case 'uni':
      // Rich Sea Urchin Lobes
      ctx.fillStyle = '#D97706';
      for (let i = -0.4; i <= 0.4; i += 0.35) {
        ctx.beginPath();
        ctx.ellipse(i * r, -r * 0.1, r * 0.2, r * 0.45, i * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Small Cucumber Slice on side
      ctx.beginPath();
      ctx.ellipse(r * 0.55, -r * 0.3, r * 0.15, r * 0.3, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#2A9D8F';
      ctx.fill();
      break;

    case 'otoro':
      // Marbled Pink Fat Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = Math.max(2.5, r * 0.06);
      [-0.4, -0.15, 0.1, 0.35].forEach((yOff) => {
        ctx.beginPath();
        ctx.moveTo(-r * 0.75, yOff * r);
        ctx.bezierCurveTo(-r * 0.2, (yOff + 0.1) * r, r * 0.2, (yOff - 0.1) * r, r * 0.75, yOff * r);
        ctx.stroke();
      });
      break;

    case 'chirashi':
      // Special Chirashi Deluxe Toppings (Ikura, Ebi tail, Tamago cube, Wasabi, Shiso)
      // Shiso leaf
      ctx.fillStyle = '#38B000';
      ctx.beginPath();
      ctx.ellipse(-r * 0.4, -r * 0.4, r * 0.3, r * 0.15, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Tamago cube
      ctx.fillStyle = '#FFD166';
      ctx.fillRect(r * 0.1, -r * 0.5, r * 0.35, r * 0.35);

      // Wasabi dab
      ctx.fillStyle = '#70E000';
      ctx.beginPath();
      ctx.arc(r * 0.4, r * 0.1, r * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Ikura Pearls
      [[-0.2, 0.2], [0.1, 0.3], [-0.3, 0.4]].forEach(([ix, iy]) => {
        ctx.beginPath();
        ctx.arc(ix * r, iy * r, r * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = '#FF4500';
        ctx.fill();
      });
      break;
  }

  ctx.restore();
}

function drawSushiFace(ctx, r, item) {
  const eyeOffset = r * 0.28;
  const eyeY = -r * 0.08;
  const eyeRadius = Math.max(2, r * 0.08);

  ctx.fillStyle = '#222222';

  if (item.type === 'chirashi') {
    // Happy anime eyes (^ ^)
    ctx.lineWidth = Math.max(2.5, r * 0.06);
    ctx.strokeStyle = '#222222';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(-eyeOffset, eyeY, eyeRadius * 1.2, Math.PI, Math.PI * 2);
    ctx.arc(eyeOffset, eyeY, eyeRadius * 1.2, Math.PI, Math.PI * 2);
    ctx.stroke();
  } else {
    // Standard cute dot eyes with shine
    ctx.beginPath();
    ctx.arc(-eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.arc(eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-eyeOffset - eyeRadius * 0.3, eyeY - eyeRadius * 0.3, eyeRadius * 0.35, 0, Math.PI * 2);
    ctx.arc(eyeOffset - eyeRadius * 0.3, eyeY - eyeRadius * 0.3, eyeRadius * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pink Blush Cheeks
  ctx.fillStyle = 'rgba(255, 105, 135, 0.55)';
  const cheekOffset = r * 0.45;
  const cheekY = r * 0.12;
  const cheekR = Math.max(2.5, r * 0.12);

  ctx.beginPath();
  ctx.arc(-cheekOffset, cheekY, cheekR, 0, Math.PI * 2);
  ctx.arc(cheekOffset, cheekY, cheekR, 0, Math.PI * 2);
  ctx.fill();

  // Cute Smile
  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.16, 0.1, Math.PI - 0.1);
  ctx.lineWidth = Math.max(1.5, r * 0.05);
  ctx.strokeStyle = '#222222';
  ctx.lineCap = 'round';
  ctx.stroke();
}
