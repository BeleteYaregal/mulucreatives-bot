const { drawQRCode, fitText } = require('../../utils/image');

module.exports = {
  id: 'darkLuxury',
  name: '02 — Dark Luxury',
  category: 'luxury',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#0B0C10';
    const textIvory = '#F5F5F0';
    const gold = colors?.secondary || '#D4AF37';
    const muted = '#8E8E93';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle hairline border
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    if (side === 'front') {
      const startX = 100;

      // Header: Company
      ctx.fillStyle = gold;
      ctx.font = 'bold 32px "Georgia", serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 140);

      if (tagline) {
        ctx.fillStyle = muted;
        ctx.font = 'italic 18px "Georgia", serif';
        ctx.fillText(tagline, startX, 170);
      }

      // Middle: Name & Title (Georgia Serif + Modern Sans Pairing)
      ctx.fillStyle = textIvory;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 650, 54, 'Georgia');
      ctx.font = `bold ${nameSize}px "Georgia", serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 350);

      ctx.fillStyle = gold;
      ctx.font = '22px "Arial", sans-serif';
      ctx.fillText((title || 'Executive Director').toUpperCase(), startX, 395);

      // Contact details (Style C: Label Prefixes T / E / W)
      ctx.fillStyle = muted;
      ctx.font = '18px "Arial", sans-serif';
      let cy = 480;
      const stepY = 32;

      if (phone) {
        ctx.fillStyle = gold;
        ctx.fillText('T', startX, cy);
        ctx.fillStyle = textIvory;
        ctx.fillText(phone, startX + 30, cy);
        cy += stepY;
      }
      if (email) {
        ctx.fillStyle = gold;
        ctx.fillText('E', startX, cy);
        ctx.fillStyle = textIvory;
        ctx.fillText(email, startX + 30, cy);
        cy += stepY;
      }
      if (website || telegram) {
        ctx.fillStyle = gold;
        ctx.fillText('W', startX, cy);
        ctx.fillStyle = textIvory;
        ctx.fillText(website || telegram, startX + 30, cy);
      }

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 100, qrSize, gold, bg);

      ctx.fillStyle = gold;
      ctx.font = 'bold 36px "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 160);
    }

    ctx.restore();
  }
};
