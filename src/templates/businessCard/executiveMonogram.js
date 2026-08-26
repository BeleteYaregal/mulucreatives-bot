const { fitText, drawQRCode, drawMonogram } = require('../../utils/image');

module.exports = {
  id: 'executiveMonogram',
  name: '10 — Executive Monogram',
  category: 'monogram',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#0D172A'; // Midnight Navy
    const primary = colors?.secondary || '#38BDF8'; // Cyan Accent
    const textWhite = '#F8FAFC';
    const muted = '#94A3B8';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      const startX = 90;

      // Draw Clean Typographic Monogram (Top Right)
      drawMonogram(ctx, name || company || 'MuluCreatives', width - 180, 90, 90, primary);

      // Left Section: Company Identity
      ctx.fillStyle = primary;
      ctx.font = 'bold 30px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);

      // Name & Title
      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 650, 52, 'Arial');
      ctx.font = `bold ${nameSize}px "Arial", sans-serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 320);

      ctx.fillStyle = primary;
      ctx.font = '22px "Arial", sans-serif';
      ctx.fillText((title || 'Executive Lead').toUpperCase(), startX, 365);

      // Divider line
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 430);
      ctx.lineTo(width - startX, 430);
      ctx.stroke();

      // Contact details (Style B: Bullet Row)
      const contacts = [phone, email, website || telegram].filter(Boolean);
      ctx.fillStyle = textWhite;
      ctx.font = '19px "Arial", sans-serif';
      ctx.fillText(contacts.join('   •   '), startX, 500);

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      drawMonogram(ctx, name || company || 'MuluCreatives', centerX - 60, centerY - 160, 120, primary);

      const qrSize = 200;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 20, qrSize, primary, bg);

      ctx.fillStyle = textWhite;
      ctx.font = 'bold 32px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 210);
    }

    ctx.restore();
  }
};
