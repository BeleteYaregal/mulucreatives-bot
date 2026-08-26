const { fitText, drawQRCode, loadImageFromBuffer, FONTS } = require('../../utils/image');

const defaultFonts = {
  sans: '"Liberation Sans", "DejaVu Sans", sans-serif',
  serif: '"Liberation Serif", "DejaVu Serif", serif',
  mono: '"Liberation Mono", "DejaVu Sans Mono", monospace'
};
const fontSans = (FONTS && FONTS.sans) ? FONTS.sans : defaultFonts.sans;

module.exports = {
  id: 'creative',
  name: '06 — Creative',
  category: 'creative',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = colors?.bg || '#18181B';
    const accent = colors?.secondary || '#E11D48';
    const textWhite = '#FAFAFA';

    ctx.save();
    
    if (side === 'front') {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      
      // Asymmetric accent block on the right (~30%)
      const blockWidth = width * 0.3;
      ctx.fillStyle = accent;
      ctx.fillRect(width - blockWidth, 0, blockWidth, height);
      
      const startX = 80;
      
      // Logo or Company Name
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, startX, 80, 100, 100);
        } catch (e) {
          ctx.fillStyle = textWhite;
          ctx.font = `bold 28px ${fontSans}`;
          ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 110);
        }
      } else {
        ctx.fillStyle = textWhite;
        ctx.font = `bold 28px ${fontSans}`;
        ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 110);
      }

      // Name & Title
      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 700, 54, fontSans.split(',')[0].replace(/"/g, ''));
      ctx.font = `bold ${Math.min(nameSize, 56)}px ${fontSans}`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 320);

      ctx.fillStyle = accent;
      ctx.font = `bold 22px ${fontSans}`;
      ctx.fillText((title || 'Creative Lead').toUpperCase(), startX, 370);

      // Accent bar
      ctx.fillStyle = accent;
      ctx.fillRect(startX, 410, 60, 4);

      // Contact info stacked
      ctx.fillStyle = textWhite;
      ctx.font = `19px ${fontSans}`;
      let cy = 480;
      const stepY = 35;
      
      const contacts = [phone, email, website || telegram, location].filter(Boolean);
      for (const contact of contacts) {
        ctx.fillText(contact, startX, cy);
        cy += stepY;
      }
      
    } else {
      // BACK
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = textWhite;
      ctx.font = `bold 36px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY - 140);
      
      const qrSize = 200;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 80, qrSize, textWhite, accent);
    }
    
    ctx.restore();
  }
};
