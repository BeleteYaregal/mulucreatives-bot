const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'elegantSerif',
  name: '09 — Elegant Serif',
  category: 'elegant',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#FDFBF7'; // Soft Cream Canvas
    const primary = colors?.primary || '#1B4332'; // Deep Emerald / Burgundy
    const gold = colors?.secondary || '#C9A050';
    const textDark = '#2B2B2B';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Double Hairline Border Frame
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    if (side === 'front') {
      const startX = 90;

      // Header: Company Name
      ctx.fillStyle = primary;
      ctx.font = 'bold 34px "Georgia", serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);

      if (tagline) {
        ctx.fillStyle = gold;
        ctx.font = 'italic 18px "Georgia", serif';
        ctx.fillText(tagline, startX, 160);
      }

      // Center Name & Title
      ctx.fillStyle = textDark;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 650, 54, 'Georgia');
      ctx.font = `bold ${nameSize}px "Georgia", serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 330);

      ctx.fillStyle = primary;
      ctx.font = 'italic 24px "Georgia", serif';
      ctx.fillText(title || 'Creative Director', startX, 375);

      // Contact details at bottom
      const contacts = [phone, email, website || telegram].filter(Boolean);
      ctx.fillStyle = textDark;
      ctx.font = '19px "Georgia", serif';
      ctx.fillText(contacts.join('   •   '), startX, 500);

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 90, qrSize, primary, bg);

      ctx.fillStyle = primary;
      ctx.font = 'bold 36px "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 170);
    }

    ctx.restore();
  }
};
