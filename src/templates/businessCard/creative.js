const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'creative',
  name: '06 — Creative',
  category: 'creative',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#18181B'; // Deep Matte Charcoal
    const textWhite = '#FAFAFA';
    const accentVibrant = colors?.secondary || '#E11D48'; // Vibrant Crimson / Rose
    const muted = '#A1A1AA';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      // Experimental Asymmetric Composition
      const startX = 80;

      // Top Left: Company
      ctx.fillStyle = accentVibrant;
      ctx.font = 'bold 28px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 110);

      // Center Asymmetric Name Typography
      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 750, 64, 'Arial');
      ctx.font = `bold ${nameSize}px "Arial", sans-serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 290);

      ctx.fillStyle = muted;
      ctx.font = '24px "Arial", sans-serif';
      ctx.fillText((title || 'Creative Lead').toUpperCase(), startX, 340);

      // Solid Offset Accent Block
      ctx.fillStyle = accentVibrant;
      ctx.fillRect(startX, 390, 80, 6);

      // Contact Information Column
      ctx.fillStyle = textWhite;
      ctx.font = '20px "Arial", sans-serif';
      let cy = 460;
      const stepY = 35;

      if (phone) {
        ctx.fillText(phone, startX, cy);
        cy += stepY;
      }
      if (email) {
        ctx.fillText(email, startX, cy);
        cy += stepY;
      }
      if (website || telegram) {
        ctx.fillText(website || telegram, startX, cy);
      }

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = accentVibrant;
      ctx.fillRect(0, 0, width, 20);

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 90, qrSize, accentVibrant, bg);

      ctx.fillStyle = textWhite;
      ctx.font = 'bold 40px "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 170);
    }

    ctx.restore();
  }
};
