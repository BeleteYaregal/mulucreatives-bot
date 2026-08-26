const { fitText, drawQRCode, loadImageFromBuffer, FONTS } = require('../../utils/image');

const defaultFonts = {
  sans: '"Liberation Sans", "DejaVu Sans", sans-serif',
  serif: '"Liberation Serif", "DejaVu Serif", serif',
  mono: '"Liberation Mono", "DejaVu Sans Mono", monospace'
};
const fontSerif = (FONTS && FONTS.serif) ? FONTS.serif : defaultFonts.serif;

module.exports = {
  id: 'elegantSerif',
  name: '09 — Elegant Serif',
  category: 'elegant',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = colors?.bg || '#FDFBF7';
    const primary = colors?.primary || '#1B4332';
    const gold = colors?.secondary || '#C9A050';
    const textDark = '#2B2B2B';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    if (side === 'front') {
      const startX = 80;

      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, startX, 80, 90, 90);
        } catch (e) {
          ctx.fillStyle = primary;
          ctx.font = `bold 32px ${fontSerif}`;
          ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);
        }
      } else {
        ctx.fillStyle = primary;
        ctx.font = `bold 32px ${fontSerif}`;
        ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);
      }

      ctx.fillStyle = textDark;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 700, 52, fontSerif.split(',')[0].replace(/"/g, ''));
      ctx.font = `bold ${Math.min(nameSize, 56)}px ${fontSerif}`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 330);

      ctx.fillStyle = primary;
      ctx.font = `italic 22px ${fontSerif}`;
      ctx.fillText(title || 'Creative Director', startX, 375);

      const contacts = [phone, email, website || telegram, location].filter(Boolean);
      ctx.fillStyle = textDark;
      ctx.font = `19px ${fontSerif}`;
      ctx.fillText(contacts.join('  ·  '), startX, 500);

    } else {
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 110, qrSize, primary, bg);

      ctx.fillStyle = primary;
      ctx.font = `bold 34px ${fontSerif}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 160);
    }

    ctx.restore();
  }
};
