const { fitText, drawQRCode, drawEthiopianMotif, loadImageFromBuffer, FONTS } = require('../../utils/image');

const defaultFonts = {
  sans: '"Liberation Sans", "DejaVu Sans", sans-serif',
  serif: '"Liberation Serif", "DejaVu Serif", serif',
  mono: '"Liberation Mono", "DejaVu Sans Mono", monospace'
};
const fontSerif = (FONTS && FONTS.serif) ? FONTS.serif : defaultFonts.serif;
const fontSans = (FONTS && FONTS.sans) ? FONTS.sans : defaultFonts.sans;

module.exports = {
  id: 'ethiopianModern',
  name: '07 — Ethiopian Modern',
  category: 'ethiopian',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = colors?.bg || '#121016';
    const gold = colors?.secondary || '#D4A017';
    const ocher = colors?.accent || '#C86428';
    const textWhite = '#FAF8F5';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawEthiopianMotif(ctx, 80, 50, width - 160, gold);
    drawEthiopianMotif(ctx, 80, height - 50, width - 160, gold);

    if (side === 'front') {
      const startX = 80;

      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, startX, 90, 80, 80);
        } catch (e) {
          ctx.fillStyle = gold;
          ctx.font = `bold 32px ${fontSerif}`;
          ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);
        }
      } else {
        ctx.fillStyle = gold;
        ctx.font = `bold 32px ${fontSerif}`;
        ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX, 130);
      }

      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Belete Yaregal', 700, 52, fontSerif.split(',')[0].replace(/"/g, ''));
      ctx.font = `bold ${Math.min(nameSize, 56)}px ${fontSerif}`;
      ctx.fillText(name || 'Belete Yaregal', startX, 330);

      ctx.fillStyle = ocher;
      ctx.font = `22px ${fontSans}`;
      ctx.fillText((title || 'Lead Architect & Designer').toUpperCase(), startX, 375);

      const cy1 = 480;
      const cy2 = 530;
      
      ctx.font = `19px ${fontSans}`;
      
      if (phone) {
        ctx.fillStyle = gold;
        ctx.fillText('📞', startX, cy1);
        ctx.fillStyle = textWhite;
        ctx.fillText(phone, startX + 35, cy1);
      }
      if (email) {
        ctx.fillStyle = gold;
        ctx.fillText('📧', startX + 350, cy1);
        ctx.fillStyle = textWhite;
        ctx.fillText(email, startX + 385, cy1);
      }
      if (website || telegram) {
        ctx.fillStyle = gold;
        ctx.fillText('🌐', startX, cy2);
        ctx.fillStyle = textWhite;
        ctx.fillText(website || telegram, startX + 35, cy2);
      }
      if (location) {
        ctx.fillStyle = gold;
        ctx.fillText('📍', startX + 350, cy2);
        ctx.fillStyle = textWhite;
        ctx.fillText(location, startX + 385, cy2);
      }

    } else {
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 100, qrSize, gold, bg);

      ctx.fillStyle = gold;
      ctx.font = `bold 34px ${fontSerif}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 170);
    }

    ctx.restore();
  }
};
