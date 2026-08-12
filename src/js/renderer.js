// Visual Canvas Renderer for Sumikkogurashi Characters ("すみっコゲーム")

import { SUMIKKO_ITEMS } from './sumikko.js';

export function drawSumikko(ctx, x, y, radius, itemDef, angle = 0, isPreview = false) {
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fill();
    ctx.restore();
  }

  // Outer ears / tails / accessories drawn behind body
  drawBackDetails(ctx, radius, itemDef);

  // Main Round Body Gradient
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

  // Front unique features (white belly patches, fur details, snout)
  drawFrontDetails(ctx, radius, itemDef);

  // Cute face (eyes, blush, mouth)
  drawSumikkoFace(ctx, radius, itemDef);

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

function drawBackDetails(ctx, r, item) {
  ctx.save();

  switch (item.type) {
    case 'ebifurai':
      // Pink Tail Fins on top
      ctx.fillStyle = '#E76F51';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.lineTo(-r * 0.35, -r * 1.3);
      ctx.lineTo(0, -r * 1.05);
      ctx.lineTo(r * 0.35, -r * 1.3);
      ctx.closePath();
      ctx.fill();
      break;

    case 'ajifurai':
      // Blue Fish Tail Fins on top
      ctx.fillStyle = '#457B9D';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.lineTo(-r * 0.35, -r * 1.25);
      ctx.lineTo(0, -r * 1.0);
      ctx.lineTo(r * 0.35, -r * 1.25);
      ctx.closePath();
      ctx.fill();
      break;

    case 'zassou':
      // Green Leaf Sprout Leaves on top
      ctx.fillStyle = '#38B000';
      ctx.beginPath();
      ctx.ellipse(-r * 0.2, -r * 1.05, r * 0.22, r * 0.45, -0.3, 0, Math.PI * 2);
      ctx.ellipse(r * 0.2, -r * 1.05, r * 0.22, r * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'nisetsumuri':
      // Brown Snail Shell on back/top
      ctx.fillStyle = '#A68A64';
      ctx.beginPath();
      ctx.arc(0, -r * 0.65, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6C584C';
      ctx.lineWidth = Math.max(2, r * 0.05);
      ctx.stroke();

      // Spiral
      ctx.beginPath();
      ctx.arc(0, -r * 0.65, r * 0.22, 0, Math.PI * 1.5);
      ctx.stroke();
      break;

    case 'neko':
      // Cat ears
      ctx.fillStyle = '#FFE599';
      ctx.beginPath();
      ctx.arc(-r * 0.65, -r * 0.7, r * 0.28, 0, Math.PI * 2);
      ctx.arc(r * 0.65, -r * 0.7, r * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Brown calico ear spot on left ear
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.arc(-r * 0.65, -r * 0.7, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'shirokuma':
      // Bear ears
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-r * 0.65, -r * 0.7, r * 0.28, 0, Math.PI * 2);
      ctx.arc(r * 0.65, -r * 0.7, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#DEE2E6';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    case 'tokage':
      // Dark Blue Dinosaur Fins on back
      ctx.fillStyle = '#0077B6';
      const finPositions = [-0.6, -0.2, 0.2];
      finPositions.forEach((pos) => {
        ctx.beginPath();
        ctx.arc(pos * r, -r * 0.9, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
  }

  ctx.restore();
}

function drawFrontDetails(ctx, r, item) {
  ctx.save();

  switch (item.type) {
    case 'penguin':
    case 'tokage':
      // White Tummy Oval Patch
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.25, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'tonkatsu':
      // Crispy fried breadcrumb texture dots
      ctx.fillStyle = 'rgba(120, 60, 0, 0.25)';
      const dots = [
        [-0.4, -0.4], [0.4, -0.3], [-0.5, 0.3], [0.5, 0.2], [0, -0.6], [0, 0.6]
      ];
      dots.forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(dx * r, dy * r, r * 0.04, 0, Math.PI * 2);
        ctx.fill();
      });

      // Pink Nose (the 1% meat!)
      ctx.fillStyle = '#FF85A1';
      ctx.beginPath();
      ctx.arc(0, r * 0.1, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'shirokuma':
      // Pink Furoshiki Scarf at neck
      ctx.fillStyle = '#FFB5A7';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.5, r * 0.45, r * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-r * 0.15, r * 0.5, r * 0.05, 0, Math.PI * 2);
      ctx.arc(r * 0.15, r * 0.5, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

function drawSumikkoFace(ctx, r, item) {
  const eyeOffset = r * 0.28;
  const eyeY = -r * 0.08;
  const eyeRadius = Math.max(2, r * 0.07);

  // Tiny classic Sumikko dot eyes
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.arc(-eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.arc(eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pink Blush Cheeks
  ctx.fillStyle = 'rgba(255, 105, 135, 0.55)';
  const cheekOffset = r * 0.45;
  const cheekY = r * 0.12;
  const cheekR = Math.max(2.5, r * 0.11);

  ctx.beginPath();
  ctx.arc(-cheekOffset, cheekY, cheekR, 0, Math.PI * 2);
  ctx.arc(cheekOffset, cheekY, cheekR, 0, Math.PI * 2);
  ctx.fill();

  // Mouth details
  if (item.type === 'penguin') {
    // Yellow Beak
    ctx.fillStyle = '#F4A261';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.06, r * 0.14, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.type !== 'tonkatsu') {
    // Small gentle smile line
    ctx.beginPath();
    ctx.arc(0, r * 0.08, r * 0.12, 0.1, Math.PI - 0.1);
    ctx.lineWidth = Math.max(1.5, r * 0.045);
    ctx.strokeStyle = '#222222';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
