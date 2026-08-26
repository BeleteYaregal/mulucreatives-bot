const { drawRoundedRect, loadImageFromBuffer, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'luxury',
  name: 'Gold & Midnight',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bgDark = '#0C0D11';
    const goldPrimary = colors?.primary || '#D4AF37';
    const goldAccent = '#F3E5AB';
    const goldSubtle = '#8A6B29';
    const textWhite = '#FFFFFF';
    const textMuted = '#C0C0C0';

    ctx.save();
    ctx.fillStyle = bgDark;
    ctx.fillRect(0, 0, width, height);

    // Subtle luxury background geometric gradient mesh
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 800);
    bgGrad.addColorStop(0, '#161822');
    bgGrad.addColorStop(1, '#0C0D11');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Metallic Gold Dual Frame Border
    const createGoldGradient = (x1, y1, x2, y2) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, goldAccent);
      g.addColorStop(0.5, goldPrimary);
      g.addColorStop(1, goldSubtle);
      return g;
    };

    const goldGrad = createGoldGradient(0, 0, width, height);

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 4;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    ctx.strokeStyle = goldSubtle;
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    if (side === 'front') {
      // 1. Company & Logo Header
      const headerY = 110;
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, 90, 80, 70, 70);
        } catch (e) {}
      }

      ctx.fillStyle = goldGrad;
      ctx.font = 'bold 36px "Georgia", serif';
      ctx.textAlign = logoBuffer ? 'left' : 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), logoBuffer ? 180 : 90, headerY);

      if (tagline) {
        ctx.fillStyle = textMuted;
        ctx.font = 'italic 20px "Georgia", serif';
        ctx.fillText(tagline, logoBuffer ? 180 : 90, headerY + 30);
      }

      // Metallic Underline Bar under header
      ctx.fillStyle = goldGrad;
      ctx.fillRect(90, headerY + 45, 250, 3);

      // 2. Main Name & Title Section
      ctx.fillStyle = textWhite;
      ctx.font = 'bold 64px "Georgia", serif';
      ctx.textAlign = 'left';
      ctx.fillText(name || 'Abel Tesfaye', 90, 310);

      ctx.fillStyle = goldPrimary;
      ctx.font = 'bold 26px "Arial", sans-serif';
      ctx.fillText((title || 'Executive Director').toUpperCase(), 90, 360);

      // 3. Contact Details Grid with Metallic Badges
      const contactX = 90;
      let contactY = 440;
      const stepY = 65;

      const drawContactRow = (drawIcon, value, label) => {
        if (!value) return;

        // Circular Gold Badge
        drawIconBadge(ctx, contactX + 25, contactY - 8, 22, goldPrimary, drawIcon || drawPhoneIcon);

        ctx.fillStyle = textWhite;
        ctx.font = '24px "Arial", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(value, contactX + 70, contactY);

        contactY += stepY;
      };

      drawContactRow(drawPhoneIcon, phone, 'PHONE');
      drawContactRow(drawEmailIcon, email, 'EMAIL');
      drawContactRow(drawTelegramIcon, telegram, 'TELEGRAM');

      // Right Column Contacts (Website & Location)
      const rightX = 750;
      let rightY = 440;
      const drawRightRow = (drawIcon, value) => {
        if (!value) return;

        drawIconBadge(ctx, rightX + 25, rightY - 8, 22, goldPrimary, drawIcon || drawLocationIcon);

        ctx.fillStyle = textWhite;
        ctx.font = '24px "Arial", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(value, rightX + 70, rightY);

        rightY += stepY;
      };

      drawRightRow(drawLocationIcon, location);
      drawRightRow(drawPhoneIcon, website);

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      // Diagonal Metallic Accent Stripe
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.moveTo(width - 400, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, 400);
      ctx.closePath();
      ctx.fill();

      // Vector QR Code Centered
      const qrSize = 280;
      const qrX = centerX - qrSize / 2;
      const qrY = centerY - qrSize / 2 - 20;

      drawQRCode(ctx, telegram || website || `https://t.me/MuluCreativesbot`, qrX, qrY, qrSize, goldPrimary, '#FFFFFF');

      // Company Name Below QR Code
      ctx.fillStyle = goldGrad;
      ctx.font = 'bold 38px "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + qrSize / 2 + 50);

      ctx.fillStyle = textMuted;
      ctx.font = '20px "Arial", sans-serif';
      ctx.fillText(website || 'www.mulucreatives.com', centerX, centerY + qrSize / 2 + 85);
    }

    ctx.restore();
  }
};
