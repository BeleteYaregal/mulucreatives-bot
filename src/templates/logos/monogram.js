const { drawRoundedRect, fitText } = require('../../utils/image');

module.exports = {
  name: 'Monogram',
  render: async function(canvas, ctx, data) {
    const { brandName, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;

    const words = brandName.trim().split(/\s+/);
    const initials = words.slice(0, 3).map(w => w.charAt(0).toUpperCase()).join('');

    const centerX = width / 2;
    const centerY = height / 2 - (tagline ? 40 : 0);
    const radius = 250;

    // Draw shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 15;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.fill();
    ctx.restore();

    // Inner shadow effect
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
    ctx.lineWidth = 40;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.stroke();
    ctx.restore();

    // Draw initials
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const maxTextWidth = radius * 1.5;
    const fontSize = fitText ? fitText(ctx, initials, maxTextWidth, 200, 'Arial') : 180;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText(initials, centerX, centerY);

    // Draw tagline
    if (tagline) {
      ctx.fillStyle = colors.secondary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const taglineFontSize = 40;
      ctx.font = `bold ${taglineFontSize}px Arial`;
      ctx.fillText(tagline, centerX, height - 120);
    }
  }
};
