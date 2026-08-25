const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, hexToRgba } = require('../../utils/image');

module.exports = {
  name: 'Modern',
  render: async function(canvas, ctx, data) {
    const { name, title, company, phone, email, photoBuffer, logoBuffer, colors } = data;
    const { primary, secondary, accent } = colors;

    // Background: Dark gradient from primary to secondary color (diagonal)
    const gradient = ctx.createLinearGradient(0, 0, 1050, 600);
    gradient.addColorStop(0, primary);
    gradient.addColorStop(1, secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1050, 600);

    // Bottom accent stripe
    ctx.fillStyle = accent;
    ctx.fillRect(0, 580, 1050, 20);

    // Left side (40%): Photo area
    if (photoBuffer) {
      // Glowing ring
      ctx.shadowColor = accent;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(210, 240, 95, 0, Math.PI * 2);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      await drawCircularImage(ctx, photoBuffer, 210, 240, 90);
    }
    
    // Name + Title
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    
    // Name
    ctx.font = 'bold 48px Georgia';
    ctx.fillText(name || 'Your Name', 210, 400);
    
    // Title
    ctx.font = '24px Arial';
    ctx.fillStyle = accent;
    ctx.fillText(title || 'Job Title', 210, 440);

    // Right side (60%): Company name at top, contact details
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 50px Arial';
    ctx.fillText(company || 'Company Name', 460, 150);
    ctx.shadowBlur = 0;

    // Line separator
    ctx.beginPath();
    ctx.moveTo(460, 180);
    ctx.lineTo(950, 180);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '28px Arial';
    ctx.fillStyle = '#EEEEEE';
    
    // Phone
    ctx.beginPath();
    ctx.arc(475, 270, 15, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText(phone || '+1 234 567 8900', 510, 280);

    // Email
    ctx.beginPath();
    ctx.arc(475, 340, 15, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText(email || 'email@example.com', 510, 350);

    // Logo
    if (logoBuffer) {
      const logo = await loadImageFromBuffer(logoBuffer);
      if (logo) {
        ctx.drawImage(logo, 920, 40, 80, 80);
      }
    }
  }
};
