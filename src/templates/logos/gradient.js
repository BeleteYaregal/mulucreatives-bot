const { fitText } = require('../../utils/image');

module.exports = {
  name: 'Gradient',
  render: async function(canvas, ctx, data) {
    const { brandName, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const centerX = width / 2;
    const centerY = height / 2 - (tagline ? 40 : 0);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = fitText ? fitText(ctx, brandName, width * 0.9, 180, 'Arial') : 160;
    ctx.font = `900 ${fontSize}px Arial`;

    // Calculate text width to size gradient
    const textWidth = ctx.measureText(brandName).width;
    const gradStartX = centerX - textWidth / 2;
    const gradEndX = centerX + textWidth / 2;
    const gradStartY = centerY - fontSize / 2;
    const gradEndY = centerY + fontSize / 2;

    // Create Gradient
    const gradient = ctx.createLinearGradient(gradStartX, gradStartY, gradEndX, gradEndY);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);

    // Text shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 15;

    ctx.fillStyle = gradient;
    ctx.fillText(brandName, centerX, centerY);
    ctx.restore();

    // Tagline
    if (tagline) {
      ctx.fillStyle = colors.accent || colors.secondary;
      ctx.textAlign = 'center';
      const taglineFontSize = Math.max(30, fontSize * 0.3);
      ctx.font = `bold ${taglineFontSize}px Arial`;
      ctx.fillText(tagline, centerX, centerY + fontSize * 0.8);
    }
  }
};
