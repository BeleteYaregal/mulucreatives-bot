const { drawRoundedRect, fitText } = require('../../utils/image');

module.exports = {
  name: 'Wordmark',
  render: async function(canvas, ctx, data) {
    const { brandName, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2;
    const centerY = height / 2 - (tagline ? 50 : 0);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = fitText ? fitText(ctx, brandName, width * 0.8, 160, 'Arial') : 120;
    ctx.font = `bold ${fontSize}px Arial`;
    
    // Draw letter by letter for spacing effect
    const letterSpacing = fontSize * 0.1;
    let totalWidth = 0;
    const charWidths = [];
    
    // Calculate total width with spacing
    for (let i = 0; i < brandName.length; i++) {
      const charWidth = ctx.measureText(brandName[i]).width;
      charWidths.push(charWidth);
      totalWidth += charWidth + (i < brandName.length - 1 ? letterSpacing : 0);
    }
    
    let currentX = centerX - totalWidth / 2;

    for (let i = 0; i < brandName.length; i++) {
      ctx.fillStyle = i === 0 ? colors.primary : colors.secondary;
      
      // First letter slightly larger
      if (i === 0) {
        ctx.font = `bold ${fontSize * 1.1}px Arial`;
      } else {
        ctx.font = `bold ${fontSize}px Arial`;
      }
      
      ctx.textAlign = 'left';
      ctx.fillText(brandName[i], currentX, centerY);
      currentX += charWidths[i] + letterSpacing;
    }

    // Underline
    const lineY = centerY + fontSize * 0.6;
    ctx.beginPath();
    ctx.moveTo(centerX - totalWidth / 2, lineY);
    ctx.lineTo(centerX + totalWidth / 2, lineY);
    ctx.lineWidth = Math.max(4, fontSize * 0.05);
    ctx.strokeStyle = colors.accent || colors.secondary;
    ctx.stroke();

    // Tagline
    if (tagline) {
      ctx.fillStyle = colors.secondary || '#666666';
      ctx.textAlign = 'center';
      const taglineFontSize = Math.max(24, fontSize * 0.3);
      ctx.font = `300 ${taglineFontSize}px Arial`;
      ctx.fillText(tagline, centerX, lineY + taglineFontSize * 1.5);
    }
  }
};
