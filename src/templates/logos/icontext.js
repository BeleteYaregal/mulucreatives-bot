const { drawRoundedRect, fitText } = require('../../utils/image');
let icons = null;
try {
  icons = require('../../data/icons');
} catch (e) {
  icons = null; // Handle if missing
}

module.exports = {
  name: 'Icon Text',
  render: async function(canvas, ctx, data) {
    const { brandName, tagline, colors, iconIndex = 0 } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const centerX = width / 2;
    let iconY = 250;
    const iconSize = 200;

    // Center adjustment if no tagline
    if (!tagline) {
      iconY = 300;
    }

    // Draw Icon
    if (icons && icons.length > 0) {
      const idx = iconIndex % icons.length;
      const drawIcon = icons[idx].drawIcon;
      if (typeof drawIcon === 'function') {
        drawIcon(ctx, centerX, iconY, iconSize, colors.primary);
      } else {
        // Fallback generic icon
        ctx.beginPath();
        ctx.arc(centerX, iconY, iconSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.fill();
      }
    } else {
      // Fallback geometric icon
      ctx.save();
      ctx.translate(centerX, iconY);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = colors.primary;
      ctx.fillRect(-iconSize/2, -iconSize/2, iconSize, iconSize);
      ctx.restore();
    }

    // Line separator
    const lineY = iconY + iconSize / 2 + 50;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, lineY);
    ctx.lineTo(centerX + 100, lineY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = colors.secondary;
    ctx.stroke();

    // Brand Name
    const textY = lineY + 80;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000'; // Default dark text
    const fontSize = fitText ? fitText(ctx, brandName, width * 0.8, 100, 'Arial') : 80;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText(brandName, centerX, textY);

    // Tagline
    if (tagline) {
      const taglineY = textY + fontSize + 20;
      ctx.fillStyle = colors.secondary || '#666666';
      const taglineFontSize = Math.max(24, fontSize * 0.4);
      ctx.font = `${taglineFontSize}px Arial`;
      ctx.fillText(tagline, centerX, taglineY);
    }
  }
};
