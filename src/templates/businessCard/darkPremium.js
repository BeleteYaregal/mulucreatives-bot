const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'darkPremium',
  name: '08 — Dark Premium',
  category: 'dark',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#141414'; // Matte Charcoal
    const textWhite = '#F2F2F2';
    const platinum = '#E0E0E0';
    const silver = '#8E8E93';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      const startX = 100;

      // Header: Company
      ctx.fillStyle = platinum;
      ctx.font = 'bold 30px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);

      // Name & Title
      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 650, 52, 'Arial');
      ctx.font = `bold ${nameSize}px "Arial", sans-serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 320);

      ctx.fillStyle = silver;
      ctx.font = '22px "Arial", sans-serif';
      ctx.fillText((title || 'Managing Director').toUpperCase(), startX, 365);

      // Divider Line
      ctx.strokeStyle = '#2A2A2A';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 430);
      ctx.lineTo(width - startX, 430);
      ctx.stroke();

      // Contact Info (Style B: Bullet Row)
      const contacts = [phone, email, website || telegram].filter(Boolean);
      ctx.fillStyle = textWhite;
      ctx.font = '19px "Arial", sans-serif';
      ctx.fillText(contacts.join('   |   '), startX, 500);

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 90, qrSize, platinum, bg);

      ctx.fillStyle = platinum;
      ctx.font = 'bold 36px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 170);
    }

    ctx.restore();
  }
};
