const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'editorial',
  name: '04 — Editorial',
  category: 'editorial',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#F7F4EF'; // Warm paper cream
    const textDark = '#1C1917';
    const muted = '#78716C';
    const accent = colors?.secondary || '#9C4A2F';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      const startX = 90;

      // Asymmetric Magazine Layout
      ctx.fillStyle = accent;
      ctx.font = 'bold 24px "Georgia", serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 120);

      // Large Name Typography balanced against small company info
      ctx.fillStyle = textDark;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 750, 60, 'Georgia');
      ctx.font = `bold ${nameSize}px "Georgia", serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 280);

      ctx.fillStyle = muted;
      ctx.font = 'italic 24px "Georgia", serif';
      ctx.fillText(title || 'Art Director', startX, 330);

      // Thin Hairline Separator
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 420);
      ctx.lineTo(width - startX, 420);
      ctx.stroke();

      // Contact details (Style B: Horizontal Bullet Row)
      const contactItems = [phone, email, website || telegram, location].filter(Boolean);
      ctx.fillStyle = textDark;
      ctx.font = '20px "Arial", sans-serif';
      ctx.fillText(contactItems.join('   /   '), startX, 500);

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = textDark;
      ctx.font = 'italic 32px "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.fillText(tagline || 'Excellence in Design & Typography', centerX, centerY - 120);

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 60, qrSize, accent, bg);

      ctx.fillStyle = textDark;
      ctx.font = 'bold 36px "Georgia", serif';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 200);
    }

    ctx.restore();
  }
};
