const { drawRoundedRect, loadImageFromBuffer, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'modern',
  name: 'Modern Chevron',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const primary = colors?.primary || '#0066FF';
    const secondary = colors?.secondary || '#00B4D8';
    const darkNavy = '#0F172A';
    const canvasBg = '#F8FAFC';
    const textDark = '#1E293B';
    const textMuted = '#64748B';

    ctx.save();

    if (side === 'front') {
      // 1. Background
      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, width, height);

      // 2. Dual Chevron Ribbons
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(480, 0);
      ctx.lineTo(760, 0);
      ctx.lineTo(580, height);
      ctx.lineTo(300, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = secondary;
      ctx.beginPath();
      ctx.moveTo(760, 0);
      ctx.lineTo(820, 0);
      ctx.lineTo(640, height);
      ctx.lineTo(580, height);
      ctx.closePath();
      ctx.fill();

      // Right Dark Section
      ctx.fillStyle = darkNavy;
      ctx.beginPath();
      ctx.moveTo(820, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(640, height);
      ctx.closePath();
      ctx.fill();

      // Top Accent Line
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, 480, 12);

      // 3. Left Content (Logo, Name, Title, Company)
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, 80, 70, 90, 90);
        } catch (e) {}
      }

      ctx.fillStyle = textDark;
      ctx.font = 'bold 36px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), logoBuffer ? 190 : 80, 110);

      if (tagline) {
        ctx.fillStyle = textMuted;
        ctx.font = '20px "Arial", sans-serif';
        ctx.fillText(tagline, logoBuffer ? 190 : 80, 145);
      }

      // Name & Title
      ctx.fillStyle = textDark;
      ctx.font = 'bold 62px "Arial", sans-serif';
      ctx.fillText(name || 'Abel Tesfaye', 80, 310);

      ctx.fillStyle = primary;
      ctx.font = 'bold 26px "Arial", sans-serif';
      ctx.fillText((title || 'Creative Director').toUpperCase(), 80, 360);

      // 4. Right Content (Contact Information)
      const rightX = 850;
      let contactY = 220;
      const stepY = 70;

      const drawRightContact = (drawIcon, value) => {
        if (!value) return;

        drawIconBadge(ctx, rightX + 25, contactY - 8, 22, primary, drawIcon || drawPhoneIcon);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '22px "Arial", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(value, rightX + 65, contactY);

        contactY += stepY;
      };

      drawRightContact(drawPhoneIcon, phone);
      drawRightContact(drawEmailIcon, email);
      drawRightContact(drawTelegramIcon, telegram);
      drawRightContact(drawLocationIcon, location);
      drawRightContact(drawPhoneIcon, website);

    } else {
      // --- Back Side ---
      ctx.fillStyle = darkNavy;
      ctx.fillRect(0, 0, width, height);

      // Bottom Left Chevron Accent
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(0, height - 220);
      ctx.lineTo(350, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Vector QR Code Frame
      const qrSize = 280;
      const qrX = 100;
      const qrY = height / 2 - qrSize / 2;

      drawQRCode(ctx, telegram || website || `https://t.me/MuluCreativesbot`, qrX, qrY, qrSize, primary, '#FFFFFF');

      // Right Side Branding & Services
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.font = 'bold 54px "Arial", sans-serif';
      ctx.fillText(company || 'MuluCreatives', 460, 200);

      ctx.fillStyle = secondary;
      ctx.font = '24px "Arial", sans-serif';
      ctx.fillText(website || 'www.mulucreatives.com', 460, 245);

      // Checked Services List
      const serviceList = services || [
        'Graphics Design & Branding',
        'Print-Ready Business Cards',
        'Logo & Identity Design',
        'Social Media Marketing Ads'
      ];

      let sy = 330;
      serviceList.slice(0, 4).forEach(srv => {
        drawCheckIcon(ctx, 480, sy - 8, 16, secondary);
        ctx.fillStyle = '#F1F5F9';
        ctx.font = '22px "Arial", sans-serif';
        ctx.fillText(srv, 515, sy);
        sy += 50;
      });
    }

    ctx.restore();
  }
};
