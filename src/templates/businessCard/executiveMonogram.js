const { fitText, drawQRCode, drawMonogram, loadImageFromBuffer, FONTS } = require('../../utils/image');

const defaultFonts = {
  sans: '"Liberation Sans", "DejaVu Sans", sans-serif',
  serif: '"Liberation Serif", "DejaVu Serif", serif',
  mono: '"Liberation Mono", "DejaVu Sans Mono", monospace'
};
const fontSans = (FONTS && FONTS.sans) ? FONTS.sans : defaultFonts.sans;

module.exports = {
  id: 'executiveMonogram',
  name: '10 — Executive Monogram',
  category: 'monogram',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = colors?.bg || '#0D172A';
    const accent = colors?.secondary || '#38BDF8';
    const textWhite = '#F8FAFC';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      const startX = 80;

      drawMonogram(ctx, name || company || 'MC', width - 170, 80, 90, accent);

      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, startX, 80, 80, 80);
        } catch (e) {
          ctx.fillStyle = accent;
          ctx.font = `bold 30px ${fontSans}`;
          ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);
        }
      } else {
        ctx.fillStyle = accent;
        ctx.font = `bold 30px ${fontSans}`;
        ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);
      }

      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 700, 52, fontSans.split(',')[0].replace(/"/g, ''));
      ctx.font = `bold ${Math.min(nameSize, 56)}px ${fontSans}`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 330);

      ctx.fillStyle = accent;
      ctx.font = `22px ${fontSans}`;
      ctx.fillText((title || 'Executive Lead').toUpperCase(), startX, 375);

      ctx.fillStyle = '#1E293B';
      ctx.fillRect(startX, 430, width - 160, 1);

      const contacts = [phone, email, website || telegram].filter(Boolean);
      ctx.fillStyle = textWhite;
      ctx.font = `19px ${fontSans}`;
      ctx.fillText(contacts.join('  ·  '), startX, 500);

    } else {
      const centerX = width / 2;
      const centerY = height / 2;

      drawMonogram(ctx, name || company || 'MC', centerX - 60, centerY - 180, 120, accent);

      const qrSize = 200;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 20, qrSize, accent, bg);

      ctx.fillStyle = textWhite;
      ctx.font = `bold 30px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 220);
    }

    ctx.restore();
  }
};
