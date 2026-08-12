// Visual Canvas Renderer for Suika Game Fruits & Environment

import { FRUITS } from './fruits.js';

export function drawFruit(ctx, x, y, radius, fruitDef, angle = 0, isPreview = false) {
  ctx.save();
  ctx.translate(x, y);

  if (!isPreview) {
    ctx.rotate(angle);
  }

  // Soft drop shadow beneath fruit
  if (!isPreview) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(2, 4, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fill();
    ctx.restore();
  }

  // Fruit Body Gradient
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
  gradient.addColorStop(0, fruitDef.gradientColor || fruitDef.color);
  gradient.addColorStop(0.85, fruitDef.color);
  gradient.addColorStop(1, fruitDef.accentColor);

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.lineWidth = Math.max(2, radius * 0.04);
  ctx.strokeStyle = fruitDef.accentColor;
  ctx.stroke();

  // Specific fruit decorative details based on ID
  drawFruitDetails(ctx, radius, fruitDef);

  // Cute face (eyes, blush, mouth)
  drawFruitFace(ctx, radius, fruitDef);

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

function drawFruitDetails(ctx, r, f) {
  // Stem / Leaf / Details
  switch (f.id) {
    case 0: // Cherry (さくらんぼ)
      // Stem
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.quadraticCurveTo(r * 0.3, -r * 1.3, r * 0.5, -r * 1.4);
      ctx.lineWidth = Math.max(2, r * 0.12);
      ctx.strokeStyle = f.leafColor;
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.ellipse(r * 0.4, -r * 1.3, r * 0.3, r * 0.15, Math.PI / 6, 0, Math.PI * 2);
      ctx.fillStyle = f.leafColor;
      ctx.fill();
      break;

    case 1: // Strawberry (いちご)
      // Seeds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      const seedCoords = [
        [-0.4, -0.3], [0.4, -0.3], [-0.5, 0.2], [0.5, 0.2],
        [0, -0.5], [0, 0.5], [-0.2, 0.1], [0.2, 0.1]
      ];
      seedCoords.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx * r, sy * r, r * 0.05, r * 0.08, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Top Leaf Cap
      ctx.fillStyle = f.leafColor;
      for (let i = 0; i < 5; i++) {
        const leafAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(
          Math.cos(leafAngle) * r * 0.6,
          Math.sin(leafAngle) * r * 0.6 - r * 0.5,
          r * 0.22,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      break;

    case 2: // Grape (ぶどう)
      // Grape surface bumps
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * 0.65, Math.sin(a) * r * 0.65, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      // Top stem
      ctx.beginPath();
      ctx.rect(-r * 0.08, -r * 1.15, r * 0.16, r * 0.3);
      ctx.fillStyle = '#6b705c';
      ctx.fill();
      break;

    case 3: // Dekopon (デコポン)
      // Top Bump
      ctx.beginPath();
      ctx.arc(0, -r * 0.95, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.fill();
      ctx.strokeStyle = f.accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    case 4: // Persimmon (かき)
      // Top Calyx Leaf
      ctx.fillStyle = f.leafColor;
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.8, r * 0.45, r * 0.18, 0, 0, Math.PI * 2);
      ctx.ellipse(0, -r * 0.8, r * 0.18, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 5: // Apple (りんご)
      // Stem
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.lineTo(r * 0.1, -r * 1.25);
      ctx.lineWidth = Math.max(2, r * 0.08);
      ctx.strokeStyle = '#582f0e';
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.ellipse(r * 0.25, -r * 1.15, r * 0.25, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = f.leafColor;
      ctx.fill();
      break;

    case 6: // Pear (なし)
      // Pear surface spots
      ctx.fillStyle = 'rgba(128, 185, 24, 0.4)';
      const spots = [
        [-0.5, -0.4], [0.6, -0.2], [-0.3, 0.5], [0.4, 0.6], [0, -0.6]
      ];
      spots.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx * r, sy * r, r * 0.04, 0, Math.PI * 2);
        ctx.fill();
      });
      // Stem
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.quadraticCurveTo(r * 0.15, -r * 1.1, r * 0.1, -r * 1.25);
      ctx.lineWidth = Math.max(2, r * 0.07);
      ctx.strokeStyle = '#6b705c';
      ctx.stroke();
      break;

    case 7: // Peach (もも)
      // Soft Center Groove
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.quadraticCurveTo(r * 0.2, 0, 0, r * 0.85);
      ctx.lineWidth = Math.max(2, r * 0.05);
      ctx.strokeStyle = 'rgba(255, 117, 143, 0.6)';
      ctx.stroke();

      // Small Leaf
      ctx.beginPath();
      ctx.ellipse(r * 0.2, -r * 0.95, r * 0.22, r * 0.1, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = f.leafColor;
      ctx.fill();
      break;

    case 8: // Pineapple (パイナップル)
      // Diamond Pattern Grid
      ctx.strokeStyle = 'rgba(180, 110, 0, 0.35)';
      ctx.lineWidth = Math.max(1.5, r * 0.04);

      const step = r * 0.35;
      for (let i = -r; i <= r; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, -Math.sqrt(Math.max(0, r * r - i * i)));
        ctx.lineTo(i + r * 0.8, Math.sqrt(Math.max(0, r * r - i * i)));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, Math.sqrt(Math.max(0, r * r - i * i)));
        ctx.lineTo(i + r * 0.8, -Math.sqrt(Math.max(0, r * r - i * i)));
        ctx.stroke();
      }

      // Crown Leaves
      ctx.fillStyle = f.leafColor;
      const crownAngles = [-0.4, -0.2, 0, 0.2, 0.4];
      crownAngles.forEach((ca) => {
        ctx.beginPath();
        ctx.save();
        ctx.rotate(ca);
        ctx.ellipse(0, -r * 1.15, r * 0.12, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;

    case 9: // Melon (メロン)
      // White Net Texture Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = Math.max(1.5, r * 0.035);

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.7, angle, angle + Math.PI / 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, angle + 0.2, angle + Math.PI / 4);
        ctx.stroke();
      }

      // T-shaped stem
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.95);
      ctx.lineTo(0, -r * 1.2);
      ctx.moveTo(-r * 0.2, -r * 1.2);
      ctx.lineTo(r * 0.2, -r * 1.2);
      ctx.lineWidth = Math.max(3, r * 0.05);
      ctx.strokeStyle = '#38b000';
      ctx.stroke();
      break;

    case 10: // Watermelon (スイカ)
      // Dark Wavy Vertical Stripes
      ctx.fillStyle = f.accentColor;
      const stripeAngles = [-0.6, -0.2, 0.2, 0.6];

      stripeAngles.forEach((sa) => {
        ctx.save();
        ctx.rotate(sa);
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.14, r * 0.96, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;
  }
}

function drawFruitFace(ctx, r, f) {
  const eyeOffset = r * 0.28;
  const eyeY = -r * 0.08;
  const eyeRadius = Math.max(2, r * 0.08);

  // Eyes
  ctx.fillStyle = f.eyeColor || '#222222';

  if (f.id === 10 || f.id === 2) {
    // Watermelon & Grape have white cute anime eyes
    ctx.beginPath();
    ctx.arc(-eyeOffset, eyeY, eyeRadius * 1.1, 0, Math.PI * 2);
    ctx.arc(eyeOffset, eyeY, eyeRadius * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Eye shines
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-eyeOffset + 1, eyeY - 1, eyeRadius * 0.4, 0, Math.PI * 2);
    ctx.arc(eyeOffset + 1, eyeY - 1, eyeRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
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

  // Cute Curved Smile
  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.18, 0.1, Math.PI - 0.1);
  ctx.lineWidth = Math.max(1.5, r * 0.05);
  ctx.strokeStyle = f.eyeColor || '#222222';
  ctx.lineCap = 'round';
  ctx.stroke();
}
