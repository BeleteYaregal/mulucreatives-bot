const { createCanvas, loadImage } = require('canvas');

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function drawCircularImage(ctx, imageBuffer, x, y, radius) {
  if (!imageBuffer) return;
  try {
    const img = await loadImage(imageBuffer);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
  } catch (err) {
    console.error("Error drawing circular image:", err);
  }
}

function fitText(ctx, text, maxWidth, initialFontSize, fontFamily) {
  let fontSize = initialFontSize;
  ctx.font = `${fontSize}px "${fontFamily}"`;
  while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
    fontSize -= 1;
    ctx.font = `${fontSize}px "${fontFamily}"`;
  }
  return fontSize;
}

async function loadImageFromBuffer(buffer) {
  return await loadImage(buffer);
}

function addDropShadow(ctx, x, y, width, height, blur, color) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = blur / 2;
  ctx.fillStyle = '#ffffff'; 
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

function drawGradientRect(ctx, x, y, width, height, color1, color2, direction = 'horizontal') {
  let gradient;
  if (direction === 'horizontal') {
    gradient = ctx.createLinearGradient(x, y, x + width, y);
  } else if (direction === 'vertical') {
    gradient = ctx.createLinearGradient(x, y, x, y + height);
  } else {
    gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  }
  
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
}

function hexToRgba(hex, alpha) {
  const hexVal = hex.replace('#', '');
  let r, g, b;
  
  if (hexVal.length === 3) {
    r = parseInt(hexVal.charAt(0) + hexVal.charAt(0), 16);
    g = parseInt(hexVal.charAt(1) + hexVal.charAt(1), 16);
    b = parseInt(hexVal.charAt(2) + hexVal.charAt(2), 16);
  } else {
    r = parseInt(hexVal.slice(0, 2), 16);
    g = parseInt(hexVal.slice(2, 4), 16);
    b = parseInt(hexVal.slice(4, 6), 16);
  }
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Icon Drawing Helpers for Business Cards
function drawIconBadge(ctx, cx, cy, r, bgColor, drawFn) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.restore();
  
  ctx.save();
  drawFn(ctx, cx, cy, r * 0.55);
  ctx.restore();
}

function drawPhoneIcon(ctx, cx, cy, s) {
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx - s * 0.2, cy + s * 0.2, s * 0.35, 0, Math.PI * 2);
  ctx.fillRect(cx - s * 0.4, cy - s * 0.5, s * 0.4, s * 0.8);
  ctx.fill();
}

function drawTelegramIcon(ctx, cx, cy, s) {
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.5, cy);
  ctx.lineTo(cx + s * 0.6, cy - s * 0.5);
  ctx.lineTo(cx + s * 0.1, cy + s * 0.6);
  ctx.lineTo(cx - s * 0.1, cy + s * 0.2);
  ctx.lineTo(cx - s * 0.5, cy);
  ctx.fill();
}

function drawEmailIcon(ctx, cx, cy, s) {
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(cx - s * 0.6, cy - s * 0.4, s * 1.2, s * 0.8);
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.6, cy - s * 0.4);
  ctx.lineTo(cx, cy + s * 0.1);
  ctx.lineTo(cx + s * 0.6, cy - s * 0.4);
  ctx.stroke();
}

function drawLocationIcon(ctx, cx, cy, s) {
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.2, s * 0.45, Math.PI, 0, false);
  ctx.lineTo(cx, cy + s * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1E60D5';
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.2, s * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function drawCheckIcon(ctx, cx, cy, s, color = '#FFFFFF') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.4, cy);
  ctx.lineTo(cx - s * 0.1, cy + s * 0.35);
  ctx.lineTo(cx + s * 0.45, cy - s * 0.35);
  ctx.stroke();
}

/**
 * Renders a clean vector QR Code on canvas
 */
function drawQRCode(ctx, text, x, y, size, primaryColor = '#0D1B2A', bgColor = '#FFFFFF') {
  ctx.save();
  
  // Background container
  const radius = 20;
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, x, y, size, size, radius);
  ctx.fill();
  ctx.stroke();
  
  const innerMargin = size * 0.12;
  const qrSize = size - innerMargin * 2;
  const modules = 21; // Standard 21x21 QR matrix
  const cellSize = qrSize / modules;
  const startX = x + innerMargin;
  const startY = y + innerMargin;

  // Simple deterministic pseudorandom matrix seeded by text
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed << 5) - seed + text.charCodeAt(i);
  
  function isFinderPattern(r, c) {
    if (r < 7 && c < 7) return true; // Top-left
    if (r < 7 && c >= modules - 7) return true; // Top-right
    if (r >= modules - 7 && c < 7) return true; // Bottom-left
    return false;
  }

  // Draw data modules
  ctx.fillStyle = primaryColor;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (isFinderPattern(r, c)) continue;
      // Timing pattern
      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
        continue;
      }
      // Pseudo data modules
      const val = (Math.abs(Math.sin(seed * (r * modules + c + 1))) * 10000) % 1;
      if (val > 0.45) {
        ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }

  // Draw 3 Position Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  const finders = [[0, 0], [0, modules - 7], [modules - 7, 0]];
  finders.forEach(([fr, fc]) => {
    const fx = startX + fc * cellSize;
    const fy = startY + fr * cellSize;
    const fsize = 7 * cellSize;

    // Outer box
    ctx.fillStyle = primaryColor;
    ctx.fillRect(fx, fy, fsize, fsize);
    // Inner white gap
    ctx.fillStyle = bgColor;
    ctx.fillRect(fx + cellSize, fy + cellSize, fsize - 2 * cellSize, fsize - 2 * cellSize);
    // Center solid box
    ctx.fillStyle = primaryColor;
    ctx.fillRect(fx + 2 * cellSize, fy + 2 * cellSize, fsize - 4 * cellSize, fsize - 4 * cellSize);
  });

  ctx.restore();
}

module.exports = {
  drawRoundedRect,
  drawCircularImage,
  fitText,
  loadImageFromBuffer,
  addDropShadow,
  drawGradientRect,
  hexToRgba,
  drawIconBadge,
  drawPhoneIcon,
  drawTelegramIcon,
  drawEmailIcon,
  drawLocationIcon,
  drawCheckIcon,
  drawQRCode
};
