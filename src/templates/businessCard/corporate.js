const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'corporate',
  name: 'Corporate Blue',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    const primary = colors?.primary || '#0056b3';
    const secondary = colors?.secondary || '#004085';
    const text = colors?.text || '#333333';
    
    ctx.fillStyle = side === 'front' ? '#ffffff' : primary;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      // Header banner
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, width, 180);
      
      // Bottom accent bar
      ctx.fillStyle = secondary;
      ctx.fillRect(0, height - 20, width, 20);

      // Logo
      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, 50, 40, 100, 100);
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(company || '', width - 50, 100);
      
      ctx.font = 'italic 24px Arial';
      ctx.fillText(tagline || '', width - 50, 140);

      // Body
      ctx.fillStyle = text;
      ctx.textAlign = 'left';
      ctx.font = 'bold 70px Arial';
      ctx.fillText(name || '', 100, 350);
      
      ctx.fillStyle = primary;
      ctx.font = '30px Arial';
      ctx.fillText((title || '').toUpperCase(), 100, 400);

      // Contact info
      ctx.fillStyle = text;
      ctx.font = '24px Arial';
      const contactX = 700;
      let contactY = 320;
      const stepY = 60;
      
      const drawContact = (iconFn, value) => {
        if (value) {
          ctx.fillStyle = primary;
          // Dummy icon drawing, as real implementation is in utils
          ctx.beginPath();
          ctx.arc(contactX - 30, contactY - 8, 15, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = text;
          ctx.fillText(value, contactX, contactY);
          contactY += stepY;
        }
      };

      drawContact(drawPhoneIcon, phone);
      drawContact(drawEmailIcon, email);
      drawContact(drawTelegramIcon, telegram);
      drawContact(drawLocationIcon, location);
      drawContact(null, website); // Assuming no specific icon for website if not provided, using generic logic or missing

    } else {
      // Back side
      ctx.fillStyle = secondary;
      ctx.fillRect(0, 0, width, height);

      // White box for QR
      const qrBoxSize = 300;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(width - qrBoxSize - 100, height / 2 - qrBoxSize / 2, qrBoxSize, qrBoxSize);
      
      ctx.fillStyle = primary;
      ctx.textAlign = 'center';
      ctx.font = '24px Arial';
      ctx.fillText('SCAN ME', width - 100 - qrBoxSize / 2, height / 2 + qrBoxSize / 2 - 20);

      // Back content
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, 100, 150, 200, 200);
      } else {
        ctx.font = 'bold 80px Arial';
        ctx.fillText(company || 'COMPANY', 100, 250);
      }
      
      ctx.font = '30px Arial';
      ctx.fillText(website || '', 100, 420);
    }
  }
};
