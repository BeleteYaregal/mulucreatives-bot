const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, hexToRgba } = require('../../utils/image');

module.exports = {
  name: 'Bold',
  render: async function(canvas, ctx, data) {
    const { name, title, company, phone, email, photoBuffer, logoBuffer, colors } = data;
    const { primary, secondary, accent } = colors;

    // Fill white first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1050, 600);

    // Diagonal split
    ctx.fillStyle = primary || '#E63946';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(450, 0);
    ctx.lineTo(550, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    // Geometric accent shapes
    ctx.fillStyle = accent || '#FFF1E6';
    ctx.beginPath();
    ctx.arc(80, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = secondary || '#F4A261';
    ctx.beginPath();
    ctx.moveTo(1000, 450);
    ctx.lineTo(1050, 500);
    ctx.lineTo(950, 550);
    ctx.closePath();
    ctx.fill();

    // Left half: Photo/Avatar + Name + Title
    ctx.textAlign = 'center';
    let avatarY = 220;

    if (photoBuffer) {
      const img = await loadImageFromBuffer(photoBuffer);
      if (img) {
        // Outer ring
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(225, avatarY, 105, 0, Math.PI * 2);
        ctx.fill();
        await drawCircularImage(ctx, img, 225, avatarY, 100);
      }
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(225, avatarY, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = primary || '#E63946';
      ctx.font = 'bold 80px Arial';
      const initial = name ? name.charAt(0).toUpperCase() : 'N';
      ctx.fillText(initial, 225, avatarY + 30);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px Arial';
    ctx.fillText(name || 'Your Name', 225, 420);

    ctx.fillStyle = accent || '#FFF1E6';
    ctx.font = '24px Arial';
    ctx.fillText(title || 'Job Title', 225, 470);

    // Right half: Company, contact, logo
    ctx.textAlign = 'left';
    ctx.fillStyle = primary || '#E63946';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(company || 'COMPANY NAME', 600, 160);

    // Details
    let startY = 320;
    
    // Phone
    ctx.fillStyle = secondary || '#F4A261';
    ctx.fillRect(600, startY - 20, 15, 15);
    ctx.fillStyle = '#333333';
    ctx.font = '26px Arial';
    ctx.fillText(phone || '+1 234 567 8900', 640, startY);

    // Email
    startY += 60;
    ctx.fillStyle = secondary || '#F4A261';
    ctx.fillRect(600, startY - 20, 15, 15);
    ctx.fillStyle = '#333333';
    ctx.fillText(email || 'email@example.com', 640, startY);

    // Logo
    if (logoBuffer) {
      const logo = await loadImageFromBuffer(logoBuffer);
      if (logo) {
        ctx.drawImage(logo, 900, 480, 80, 80);
      }
    }
  }
};
