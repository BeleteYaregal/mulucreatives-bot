const { fitText, drawQRCode, loadImageFromBuffer, FONTS } = require('../../utils/image');

const defaultFonts = {
  sans: '"Liberation Sans", "DejaVu Sans", sans-serif',
  serif: '"Liberation Serif", "DejaVu Serif", serif',
  mono: '"Liberation Mono", "DejaVu Sans Mono", monospace'
};
const fontSans = (FONTS && FONTS.sans) ? FONTS.sans : defaultFonts.sans;

module.exports = {
  id: 'darkPremium',
  name: '08 — Dark Premium',
  category: 'dark',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#111111';
    const platinum = '#E0E0E0';
    const silver = '#8E8E93';
    const textWhite = '#FFFFFF';

    ctx.save();
    
    // Gradient overlay
    const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
    bgGrad.addColorStop(0, '#1E1E1E');
    bgGrad.addColorStop(1, '#0A0A0A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      const startX = 80;

      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, startX, 80, 90, 90);
        } catch (e) {
          ctx.fillStyle = platinum;
          ctx.font = `bold 30px ${fontSans}`;
          ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 120);
        }
      } else {
        ctx.fillStyle = platinum;
        ctx.font = `bold 30px ${fontSans}`;
        ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 120);
      }

      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 700, 52, fontSans.split(',')[0].replace(/"/g, ''));
      ctx.font = `bold ${Math.min(nameSize, 56)}px ${fontSans}`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 330);

      ctx.fillStyle = silver;
      ctx.font = `22px ${fontSans}`;
      ctx.fillText((title || 'Managing Director'), startX, 375);

      ctx.fillStyle = '#2A2A2A';
      ctx.fillRect(startX, 430, width - 160, 1);

      const contacts = [phone, email, website || telegram].filter(Boolean);
      ctx.fillStyle = textWhite;
      ctx.font = `19px ${fontSans}`;
      ctx.fillText(contacts.join('   |   '), startX, 500);

    } else {
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 100, qrSize, platinum, bg);

      ctx.fillStyle = platinum;
      ctx.font = `bold 32px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 180);
    }

    ctx.restore();
  }
};
