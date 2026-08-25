const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, hexToRgba } = require('../../utils/image');

module.exports = {
  name: 'Classic',
  render: async function(canvas, ctx, data) {
    const { name, title, company, phone, email, photoBuffer, logoBuffer, colors } = data;
    const { primary, secondary, accent } = colors;

    // Background: Off-white
    ctx.fillStyle = '#FEFCF3';
    ctx.fillRect(0, 0, 1050, 600);

    // Double border in gold/accent
    ctx.strokeStyle = accent || '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 990, 540);
    ctx.strokeRect(38, 38, 974, 524);

    // Decorative corners
    ctx.lineWidth = 4;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(20, 50); ctx.lineTo(20, 20); ctx.lineTo(50, 20);
    // Top-right
    ctx.moveTo(1000, 20); ctx.lineTo(1030, 20); ctx.lineTo(1030, 50);
    // Bottom-right
    ctx.moveTo(1030, 550); ctx.lineTo(1030, 580); ctx.lineTo(1000, 580);
    // Bottom-left
    ctx.moveTo(50, 580); ctx.lineTo(20, 580); ctx.lineTo(20, 550);
    ctx.stroke();

    // Top center: Logo or company name
    ctx.textAlign = 'center';
    ctx.fillStyle = primary || '#333333';
    if (logoBuffer) {
      const logo = await loadImageFromBuffer(logoBuffer);
      if (logo) {
        ctx.drawImage(logo, 525 - 40, 70, 80, 80);
      }
    } else {
      ctx.font = 'bold 36px Georgia';
      ctx.fillText(company || 'COMPANY NAME', 525, 120);
    }

    // Center: Name & Title
    // Photo
    if (photoBuffer) {
      const img = await loadImageFromBuffer(photoBuffer);
      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(320, 220, 120, 150);
        ctx.clip();
        ctx.drawImage(img, 320, 220, 120, 150);
        ctx.restore();
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = accent || '#D4AF37';
        ctx.strokeRect(320, 220, 120, 150);
        
        ctx.textAlign = 'left';
        ctx.font = 'bold 52px Georgia';
        ctx.fillStyle = primary || '#111111';
        ctx.fillText(name || 'Your Name', 470, 280);
        
        ctx.font = 'italic 28px Georgia';
        ctx.fillStyle = secondary || '#555555';
        ctx.fillText(title || 'Job Title', 470, 330);
      }
    } else {
      ctx.textAlign = 'center';
      ctx.font = 'bold 56px Georgia';
      ctx.fillStyle = primary || '#111111';
      ctx.fillText(name || 'Your Name', 525, 300);
      
      ctx.font = 'italic 28px Georgia';
      ctx.fillStyle = secondary || '#555555';
      ctx.fillText(title || 'Job Title', 525, 360);
    }

    // Bottom section: Phone | Email
    ctx.textAlign = 'center';
    ctx.font = '24px Georgia';
    ctx.fillStyle = primary || '#333333';
    const text = `${phone || '+1 234 567 8900'}   •   ${email || 'email@example.com'}`;
    ctx.fillText(text, 525, 520);
  }
};
