const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'creative',
  name: 'Bold Split',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    const primary = colors?.primary || '#ff4b4b';
    const dark = '#1a1a1a';
    
    if (side === 'front') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Diagonal split
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width * 0.45, 0);
      ctx.lineTo(width * 0.25, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Photo or Logo in circle
      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.save();
        ctx.beginPath();
        ctx.arc(width * 0.2, height / 2, 120, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, width * 0.2 - 120, height / 2 - 120, 240, 240);
        ctx.restore();
      }

      ctx.fillStyle = dark;
      ctx.textAlign = 'left';
      ctx.font = 'bold 80px "Montserrat", sans-serif';
      ctx.fillText((name || '').toUpperCase(), width * 0.4, 250);
      
      ctx.fillStyle = primary;
      ctx.font = 'bold 30px "Montserrat", sans-serif';
      ctx.fillText((title || '').toUpperCase(), width * 0.4 + 5, 300);

      ctx.fillStyle = '#555555';
      ctx.font = '22px "Montserrat", sans-serif';
      let cy = 450;
      const contacts = [phone, email, telegram, website, location];
      contacts.forEach(c => {
        if (c) {
          ctx.fillText(c, width * 0.4, cy);
          cy += 45;
        }
      });

    } else {
      ctx.fillStyle = dark;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(width, height);
      ctx.lineTo(width * 0.55, height);
      ctx.lineTo(width * 0.75, 0);
      ctx.lineTo(width, 0);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 60px "Montserrat", sans-serif';
      ctx.fillText(company || '', width * 0.35, height / 2);
      ctx.font = '24px "Montserrat", sans-serif';
      ctx.fillText(tagline || '', width * 0.35, height / 2 + 50);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(width * 0.75 - 75, height / 2 - 120, 240, 240);
    }
  }
};
