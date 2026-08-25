const { drawRoundedRect } = require('../../utils/image');

function drawCurvedText(ctx, text, centerX, centerY, radius, startAngle, isTop) {
  ctx.save();
  const chars = text.split('');
  // Calculate total angle needed
  const totalAngle = chars.reduce((sum, char) => {
    return sum + ctx.measureText(char).width / radius;
  }, 0);
  let currentAngle = startAngle - totalAngle / 2;
  if (!isTop) currentAngle = startAngle + totalAngle / 2;
  
  for (const char of (isTop ? chars : chars.reverse())) {
    const charWidth = ctx.measureText(char).width / radius;
    if (isTop) currentAngle += charWidth / 2;
    else currentAngle -= charWidth / 2;
    
    ctx.save();
    ctx.translate(centerX + Math.cos(currentAngle) * radius, centerY + Math.sin(currentAngle) * radius);
    ctx.rotate(currentAngle + (isTop ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();
    
    if (isTop) currentAngle += charWidth / 2;
    else currentAngle -= charWidth / 2;
  }
  ctx.restore();
}

module.exports = {
  name: 'Badge',
  render: async function(canvas, ctx, data) {
    const { brandName, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 320;
    const innerRadius = 240;

    // Outer Circle Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.fill();

    // Outer Circle Border
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius - 15, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Inner Circle Border
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = colors.secondary || '#FFFFFF';
    ctx.stroke();

    // Inner filled area
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Center shape/letter
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 200px Arial';
    ctx.fillText(brandName.charAt(0).toUpperCase(), centerX, centerY + 15);

    // Text settings for curved text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 45px Arial';
    ctx.textBaseline = 'middle';

    const textRadius = (outerRadius + innerRadius) / 2;

    // Brand Name curved text (Top)
    drawCurvedText(ctx, brandName.toUpperCase(), centerX, centerY, textRadius, -Math.PI / 2, true);

    // Tagline curved text (Bottom)
    if (tagline) {
      ctx.font = '35px Arial';
      drawCurvedText(ctx, tagline.toUpperCase(), centerX, centerY, textRadius, Math.PI / 2, false);
    }

    // Decorative dots
    ctx.fillStyle = colors.accent || '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX - textRadius, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + textRadius, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
  }
};
