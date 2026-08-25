const { fitText } = require('../../utils/image');

module.exports = {
  name: 'Geometric',
  render: async function(canvas, ctx, data) {
    const { brandName, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const centerX = width / 2;
    let graphicY = 280;

    if (!tagline) {
      graphicY = 320;
    }

    // Base settings for shapes
    ctx.globalCompositeOperation = 'multiply';

    // Shape 1: Circle (Primary)
    ctx.beginPath();
    ctx.arc(centerX - 60, graphicY - 20, 100, 0, Math.PI * 2);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = colors.primary;
    ctx.fill();

    // Shape 2: Circle (Secondary)
    ctx.beginPath();
    ctx.arc(centerX + 60, graphicY - 20, 100, 0, Math.PI * 2);
    ctx.fillStyle = colors.secondary;
    ctx.fill();

    // Shape 3: Triangle (Accent)
    ctx.beginPath();
    ctx.moveTo(centerX, graphicY - 140);
    ctx.lineTo(centerX + 100, graphicY + 50);
    ctx.lineTo(centerX - 100, graphicY + 50);
    ctx.closePath();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = colors.accent || '#F0F0F0';
    ctx.fill();

    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    // Text rendering
    const textY = graphicY + 180;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = '#222222';
    const fontSize = fitText ? fitText(ctx, brandName, width * 0.8, 100, 'Arial') : 90;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText(brandName, centerX, textY);

    if (tagline) {
      const taglineY = textY + fontSize + 10;
      ctx.fillStyle = colors.secondary || '#666666';
      ctx.font = `${Math.max(24, fontSize * 0.35)}px Arial`;
      ctx.letterSpacing = "2px";
      ctx.fillText(tagline.toUpperCase(), centerX, taglineY);
    }
  }
};
