const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'modernCorporate',
  name: '03 — Modern Corporate',
  category: 'corporate',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#FFFFFF';
    const textDark = '#0F172A';
    const primary = colors?.primary || '#0A192F';
    const accent = colors?.secondary || '#0284C7';
    const muted = '#64748B';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      const startX = 90;

      // Small brand accent line (Left border indicator)
      ctx.fillStyle = accent;
      ctx.fillRect(startX, 100, 4, 60);

      // Company Identity
      ctx.fillStyle = primary;
      ctx.font = 'bold 32px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX + 25, 135);

      if (tagline) {
        ctx.fillStyle = muted;
        ctx.font = '18px "Arial", sans-serif';
        ctx.fillText(tagline, startX + 25, 162);
      }

      // Name & Title
      ctx.fillStyle = textDark;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 650, 52, 'Arial');
      ctx.font = `bold ${nameSize}px "Arial", sans-serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 330);

      ctx.fillStyle = accent;
      ctx.font = 'bold 22px "Arial", sans-serif';
      ctx.fillText((title || 'Senior Creative Director').toUpperCase(), startX, 375);

      // Structured Contact Section (Two-Column Layout - Style E)
      ctx.fillStyle = textDark;
      ctx.font = '20px "Arial", sans-serif';

      const col1X = startX;
      const col2X = 650;
      let y = 470;

      if (phone) {
        ctx.fillStyle = muted;
        ctx.fillText('Phone:', col1X, y);
        ctx.fillStyle = textDark;
        ctx.fillText(phone, col1X + 80, y);
      }

      if (email) {
        ctx.fillStyle = muted;
        ctx.fillText('Email:', col2X, y);
        ctx.fillStyle = textDark;
        ctx.fillText(email, col2X + 80, y);
      }

      y += 45;

      if (website || telegram) {
        ctx.fillStyle = muted;
        ctx.fillText('Web:', col1X, y);
        ctx.fillStyle = textDark;
        ctx.fillText(website || telegram, col1X + 80, y);
      }

      if (location) {
        ctx.fillStyle = muted;
        ctx.fillText('Office:', col2X, y);
        ctx.fillStyle = textDark;
        ctx.fillText(location, col2X + 80, y);
      }

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, width, height);

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 90, qrSize, accent, '#FFFFFF');

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 170);
    }

    ctx.restore();
  }
};
