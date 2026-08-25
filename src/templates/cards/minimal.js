const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, hexToRgba } = require('../../utils/image');

module.exports = {
  name: 'Minimal',
  render: async function(canvas, ctx, data) {
    const { name, title, company, phone, email, photoBuffer, logoBuffer, colors } = data;
    const { primary, secondary, accent } = colors;

    // Background: Pure white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1050, 600);

    // Left side: Vertical accent line
    ctx.fillStyle = primary || '#000000';
    ctx.fillRect(60, 0, 2, 600);

    // Logo: Bottom-right corner
    if (logoBuffer) {
      const logo = await loadImageFromBuffer(logoBuffer);
      if (logo) {
        ctx.drawImage(logo, 950, 500, 50, 50);
      }
    }

    let startX = 120;
    let nameY = 250;

    // Photo next to name
    if (photoBuffer) {
      const img = await loadImageFromBuffer(photoBuffer);
      if (img) {
        await drawCircularImage(ctx, img, 160, 230, 40);
        startX = 230;
      }
    }

    // Name
    ctx.textAlign = 'left';
    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = '#111111';
    ctx.fillText(name || 'Your Name', startX, nameY);

    // Title
    ctx.font = '28px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText(title || 'Job Title', startX, nameY + 50);

    // Company
    ctx.font = '500 32px Arial';
    ctx.fillStyle = secondary || '#333333';
    ctx.fillText(company || 'Company Name', startX, nameY + 110);

    // Bottom-left: Phone and email
    ctx.font = '22px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(phone || '+1 234 567 8900', 120, 520);
    ctx.fillText(email || 'email@example.com', 120, 560);
  }
};
