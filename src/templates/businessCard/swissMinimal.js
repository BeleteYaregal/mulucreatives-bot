const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'swissMinimal',
  name: '01 — Swiss Minimal',
  category: 'minimal',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = colors?.bg || '#FBFBFB';
    const textDark = '#111111';
    const textMuted = '#666666';
    const accentRed = colors?.secondary || '#D90429';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      // Safe area padding: 80px
      const startX = 80;
      
      // Top section: Company identity
      ctx.fillStyle = textDark;
      ctx.font = 'bold 30px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 120);

      if (tagline) {
        ctx.fillStyle = textMuted;
        ctx.font = '18px "Arial", sans-serif';
        ctx.fillText(tagline, startX, 150);
      }

      // Middle section: Name & Title (Proportional & Restrained)
      ctx.fillStyle = textDark;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 700, 52, 'Arial');
      ctx.font = `bold ${nameSize}px "Arial", sans-serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 360);

      ctx.fillStyle = accentRed;
      ctx.font = '22px "Arial", sans-serif';
      ctx.fillText((title || 'Creative Director').toUpperCase(), startX, 405);

      // Subtle 1px Swiss horizontal hairline dividing rule
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 500);
      ctx.lineTo(width - startX, 500);
      ctx.stroke();

      // Bottom section: Contact Info (Dot-Separated Bullet Row - Style B)
      const contactItems = [phone, email, website || telegram, location].filter(Boolean);
      ctx.fillStyle = textDark;
      ctx.font = '20px "Arial", sans-serif';
      ctx.fillText(contactItems.join('   •   '), startX, 570);

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = textDark;
      ctx.font = 'bold 44px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY - 140);

      const qrSize = 240;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 80, qrSize, textDark, bg);

      ctx.fillStyle = textMuted;
      ctx.font = '20px "Arial", sans-serif';
      ctx.fillText(website || 'www.mulucreatives.com', centerX, centerY + 210);
    }

    ctx.restore();
  }
};
