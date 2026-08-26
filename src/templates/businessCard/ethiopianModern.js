const { fitText, drawQRCode, drawEthiopianMotif } = require('../../utils/image');

module.exports = {
  id: 'ethiopianModern',
  name: '07 — Ethiopian Modern',
  category: 'ethiopian',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#121016'; // Deep Ethiopian Espresso / Indigo
    const gold = colors?.secondary || '#D4A017'; // Ethiopian Gold Accent
    const ocher = '#C86428'; // Warm Terrazzo/Ocher Accent
    const textWhite = '#FAF8F5';
    const muted = '#A59DAB';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Contemporary Ethiopian Geometric Motif Accent Line at Top & Bottom
    drawEthiopianMotif(ctx, 80, 50, width - 160, gold);
    drawEthiopianMotif(ctx, 80, height - 50, width - 160, gold);

    if (side === 'front') {
      const startX = 100;

      // Company Identity
      ctx.fillStyle = gold;
      ctx.font = 'bold 34px "Georgia", serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 135);

      if (tagline) {
        ctx.fillStyle = muted;
        ctx.font = 'italic 18px "Georgia", serif';
        ctx.fillText(tagline, startX, 168);
      }

      // Name & Title
      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Belete Yaregal', 650, 54, 'Georgia');
      ctx.font = `bold ${nameSize}px "Georgia", serif`;
      ctx.fillText(name || 'Belete Yaregal', startX, 320);

      ctx.fillStyle = ocher;
      ctx.font = 'bold 22px "Arial", sans-serif';
      ctx.fillText((title || 'Lead Architect & Designer').toUpperCase(), startX, 365);

      // Contact Details (Style D: Minimalist Line Divider)
      ctx.strokeStyle = '#2B2633';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 430);
      ctx.lineTo(width - startX, 430);
      ctx.stroke();

      ctx.fillStyle = textWhite;
      ctx.font = '20px "Arial", sans-serif';
      let cy = 485;
      const stepY = 36;

      if (phone) {
        ctx.fillStyle = gold;
        ctx.fillText('📞', startX, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(phone, startX + 35, cy);
      }

      if (email) {
        ctx.fillStyle = gold;
        ctx.fillText('📧', startX + 350, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(email, startX + 385, cy);
      }

      cy += stepY;

      if (website || telegram) {
        ctx.fillStyle = gold;
        ctx.fillText('🌐', startX, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(website || telegram, startX + 35, cy);
      }

      if (location) {
        ctx.fillStyle = gold;
        ctx.fillText('📍', startX + 350, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(location, startX + 385, cy);
      }

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 90, qrSize, gold, bg);

      ctx.fillStyle = gold;
      ctx.font = 'bold 38px "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 170);
    }

    ctx.restore();
  }
};
