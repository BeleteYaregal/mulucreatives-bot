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
  // Caller decides whether to fill() or stroke()
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
  } else { // diagonal
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

module.exports = {
  drawRoundedRect,
  drawCircularImage,
  fitText,
  loadImageFromBuffer,
  addDropShadow,
  drawGradientRect,
  hexToRgba
};
