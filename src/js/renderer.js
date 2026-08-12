// Visual Canvas Renderer for Animal Characters & Environment

import { ANIMALS } from './animals.js';

export function drawAnimal(ctx, x, y, radius, itemDef, angle = 0, isPreview = false) {
  ctx.save();
  ctx.translate(x, y);

  if (!isPreview) {
    ctx.rotate(angle);
  }

  // Soft drop shadow beneath animal
  if (!isPreview) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(2, 4, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fill();
    ctx.restore();
  }

  // Outer ears / limbs drawn behind body
  drawEarsAndLimbs(ctx, radius, itemDef);

  // Main Animal Round Body Gradient
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

  // Draw unique animal features (whiskers, Panda eye patches, Elephant trunk, Beak, etc.)
  drawAnimalFeatures(ctx, radius, itemDef);

  // Cute face (eyes, blush cheeks, nose/mouth)
  drawAnimalFace(ctx, radius, itemDef);

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

function drawEarsAndLimbs(ctx, r, a) {
  ctx.save();

  switch (a.type) {
    case 'hamster':
      // Small round ears
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.arc(-r * 0.7, -r * 0.7, r * 0.3, 0, Math.PI * 2);
      ctx.arc(r * 0.7, -r * 0.7, r * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = a.innerEarColor;
      ctx.beginPath();
      ctx.arc(-r * 0.7, -r * 0.7, r * 0.18, 0, Math.PI * 2);
      ctx.arc(r * 0.7, -r * 0.7, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'chick':
      // Little feather tuft on top
      ctx.fillStyle = a.color;
      ctx.beginPath();
      ctx.ellipse(0, -r * 1.05, r * 0.12, r * 0.22, 0.1, 0, Math.PI * 2);
      ctx.ellipse(r * 0.12, -r * 1.05, r * 0.1, r * 0.18, -0.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'cat':
      // Pointy Triangle Cat Ears
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.3);
      ctx.lineTo(-r * 0.75, -r * 1.15);
      ctx.lineTo(-r * 0.25, -r * 0.8);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.8, -r * 0.3);
      ctx.lineTo(r * 0.75, -r * 1.15);
      ctx.lineTo(r * 0.25, -r * 0.8);
      ctx.closePath();
      ctx.fill();

      // Inner Pink Ear
      ctx.fillStyle = a.innerEarColor;
      ctx.beginPath();
      ctx.moveTo(-r * 0.72, -r * 0.4);
      ctx.lineTo(-r * 0.7, -r * 1.0);
      ctx.lineTo(-r * 0.32, -r * 0.75);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.72, -r * 0.4);
      ctx.lineTo(r * 0.7, -r * 1.0);
      ctx.lineTo(r * 0.32, -r * 0.75);
      ctx.closePath();
      ctx.fill();
      break;

    case 'dog':
      // Floppy Dog Ears on sides
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.85, 0, r * 0.25, r * 0.55, 0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.85, 0, r * 0.25, r * 0.55, -0.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'rabbit':
      // Long Bunny Ears
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 1.3, r * 0.22, r * 0.65, -0.15, 0, Math.PI * 2);
      ctx.ellipse(r * 0.35, -r * 1.3, r * 0.22, r * 0.65, 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = a.innerEarColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 1.3, r * 0.12, r * 0.48, -0.15, 0, Math.PI * 2);
      ctx.ellipse(r * 0.35, -r * 1.3, r * 0.12, r * 0.48, 0.15, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'panda':
      // Black Panda Ears on top
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.arc(-r * 0.65, -r * 0.75, r * 0.32, 0, Math.PI * 2);
      ctx.arc(r * 0.65, -r * 0.75, r * 0.32, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'corgi':
      // Tall Pointy Corgi Ears
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.55, -r * 0.95, r * 0.22, r * 0.45, -0.3, 0, Math.PI * 2);
      ctx.ellipse(r * 0.55, -r * 0.95, r * 0.22, r * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = a.innerEarColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.55, -r * 0.95, r * 0.12, r * 0.3, -0.3, 0, Math.PI * 2);
      ctx.ellipse(r * 0.55, -r * 0.95, r * 0.12, r * 0.3, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'otter':
      // Small round ears
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.arc(-r * 0.8, -r * 0.5, r * 0.2, 0, Math.PI * 2);
      ctx.arc(r * 0.8, -r * 0.5, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'alpaca':
      // Fluffy ears & head puff
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.6, -r * 0.9, r * 0.18, r * 0.4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(r * 0.6, -r * 0.9, r * 0.18, r * 0.4, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy Head Tuft
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, -r * 0.9, r * 0.32, 0, Math.PI * 2);
      ctx.arc(-r * 0.2, -r * 0.85, r * 0.25, 0, Math.PI * 2);
      ctx.arc(r * 0.2, -r * 0.85, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'capybara':
      // Tiny Capybara ears
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.75, -r * 0.6, r * 0.15, r * 0.22, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.75, -r * 0.6, r * 0.15, r * 0.22, 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'elephant':
      // Huge Giant Elephant Ears on sides
      ctx.fillStyle = a.earColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.9, -r * 0.1, r * 0.45, r * 0.65, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.9, -r * 0.1, r * 0.45, r * 0.65, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = a.innerEarColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.9, -r * 0.1, r * 0.28, r * 0.45, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.9, -r * 0.1, r * 0.28, r * 0.45, 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

function drawAnimalFeatures(ctx, r, a) {
  switch (a.type) {
    case 'chick':
      // Beak
      ctx.fillStyle = a.beakColor;
      ctx.beginPath();
      ctx.moveTo(-r * 0.15, 0);
      ctx.lineTo(r * 0.15, 0);
      ctx.lineTo(0, r * 0.2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'cat':
      // Whiskers
      ctx.strokeStyle = a.accentColor;
      ctx.lineWidth = Math.max(1.5, r * 0.04);
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, r * 0.1);
      ctx.lineTo(-r * 0.85, 0);
      ctx.moveTo(-r * 0.3, r * 0.2);
      ctx.lineTo(-r * 0.85, r * 0.3);
      ctx.moveTo(r * 0.3, r * 0.1);
      ctx.lineTo(r * 0.85, 0);
      ctx.moveTo(r * 0.3, r * 0.2);
      ctx.lineTo(r * 0.85, r * 0.3);
      ctx.stroke();
      break;

    case 'panda':
      // Black eye patches
      ctx.fillStyle = a.eyePatchColor;
      ctx.beginPath();
      ctx.ellipse(-r * 0.32, -r * 0.1, r * 0.25, r * 0.22, 0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.32, -r * 0.1, r * 0.25, r * 0.22, -0.2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'corgi':
      // White muzzle patch
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.25, r * 0.4, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'capybara':
      // Sleepy snout shape
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.15, r * 0.38, r * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'elephant':
      // Elephant Trunk
      ctx.fillStyle = a.accentColor;
      ctx.beginPath();
      ctx.moveTo(-r * 0.15, r * 0.1);
      ctx.quadraticCurveTo(0, r * 0.6, r * 0.3, r * 0.65);
      ctx.quadraticCurveTo(r * 0.45, r * 0.6, r * 0.25, r * 0.45);
      ctx.quadraticCurveTo(0, r * 0.4, r * 0.15, r * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
  }
}

function drawAnimalFace(ctx, r, a) {
  const eyeOffset = r * 0.3;
  const eyeY = -r * 0.1;
  const eyeRadius = Math.max(2, r * 0.08);

  ctx.fillStyle = a.eyeColor || '#222222';

  if (a.type === 'panda') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-eyeOffset, eyeY, eyeRadius * 1.2, 0, Math.PI * 2);
    ctx.arc(eyeOffset, eyeY, eyeRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-eyeOffset, eyeY, eyeRadius * 0.6, 0, Math.PI * 2);
    ctx.arc(eyeOffset, eyeY, eyeRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (a.type === 'capybara') {
    ctx.lineWidth = Math.max(2, r * 0.06);
    ctx.strokeStyle = a.eyeColor;
    ctx.beginPath();
    ctx.moveTo(-eyeOffset - r * 0.1, eyeY);
    ctx.lineTo(-eyeOffset + r * 0.1, eyeY);
    ctx.moveTo(eyeOffset - r * 0.1, eyeY);
    ctx.lineTo(eyeOffset + r * 0.1, eyeY);
    ctx.stroke();
  } else {
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
  const cheekOffset = r * 0.48;
  const cheekY = r * 0.12;
  const cheekR = Math.max(2.5, r * 0.12);

  ctx.beginPath();
  ctx.arc(-cheekOffset, cheekY, cheekR, 0, Math.PI * 2);
  ctx.arc(cheekOffset, cheekY, cheekR, 0, Math.PI * 2);
  ctx.fill();

  // Cute Nose/Mouth (except Chick which has beak)
  if (a.type !== 'chick' && a.type !== 'elephant') {
    ctx.fillStyle = a.accentColor || '#222222';
    ctx.beginPath();
    ctx.arc(0, r * 0.08, Math.max(1.5, r * 0.05), 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.14, 0.1, Math.PI - 0.1);
    ctx.lineWidth = Math.max(1.5, r * 0.05);
    ctx.strokeStyle = a.accentColor || '#222222';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
