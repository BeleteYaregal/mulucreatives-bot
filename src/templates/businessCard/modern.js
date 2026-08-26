const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'modern',
  name: 'Modern Chevron',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    const primary = colors?.primary || '#0d6efd';
    const dark = '#1a1a24';
    const offWhite = '#f8f9fa';
    
    if (side === 'front') {
      ctx.fillStyle = offWhite;
      ctx.fillRect(0, 0, width, height);

      // Chevron ribbon background
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(500, 0);
      ctx.lineTo(800, 0);
      ctx.lineTo(600, height);
      ctx.lineTo(300, height);
      ctx.fill();

      // Right dark section
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(800, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(600, height);
      ctx.fill();

      // Front content left
      ctx.fillStyle = dark;
      ctx.font = 'bold 60px "Helvetica Neue", Arial';
      ctx.fillText(name || '', 80, 200);
      
      ctx.fillStyle = primary;
      ctx.font = '30px "Helvetica Neue", Arial';
      ctx.fillText((title || '').toUpperCase(), 80, 250);

      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, 80, 60, 80, 80);
      }

      // Front content right
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.font = '22px "Helvetica Neue", Arial';
      
      const drawContact = (value, yOffset) => {
        if (value) {
          ctx.fillText(value, width - 80, yOffset);
        }
      };

      drawContact(phone, 200);
      drawContact(email, 260);
      drawContact(website, 320);
      drawContact(location, 380);

    } else {
      // Back side
      ctx.fillStyle = dark;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(0, height - 200);
      ctx.lineTo(300, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // QR box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(100, height / 2 - 150, 300, 300);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.font = 'bold 50px "Helvetica Neue", Arial';
      ctx.fillText(company || '', 500, 200);
      ctx.font = '24px "Helvetica Neue", Arial';
      ctx.fillText(tagline || '', 500, 250);

      // Services checklist
      if (services && services.length > 0) {
        let sy = 350;
        ctx.font = '22px "Helvetica Neue", Arial';
        services.forEach(srv => {
          ctx.fillStyle = primary;
          ctx.fillText('✔', 500, sy);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(srv, 540, sy);
          sy += 40;
        });
      }
    }
  }
};
