const { FONTS, drawQRCode, loadImageFromBuffer, fitText } = require('../../utils/image');

module.exports = {
  id: 'swissMinimal',
  name: 'Swiss Minimal',
  category: 'Business Card',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Background
    ctx.fillStyle = colors.bg || '#FAFAFA';
    ctx.fillRect(0, 0, width, height);
    
    if (side === 'front') {
      // Accent line
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(70, 80, 2, height - 160);
      
      // Company
      if (company) {
        ctx.fillStyle = colors.muted;
        ctx.font = `28px ${FONTS.sans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(company.toUpperCase(), 140, 80);
      }
      
      // Name
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const nameSize = fitText(ctx, name || '', 700, 52, FONTS.sans);
      ctx.font = `bold ${nameSize}px ${FONTS.sans}`;
      ctx.fillText(name || '', 140, 320);
      
      // Title
      ctx.fillStyle = colors.secondary;
      ctx.font = `22px ${FONTS.sans}`;
      ctx.fillText((title || '').toUpperCase(), 140, 370);
      
      // Divider
      ctx.fillStyle = colors.muted;
      ctx.fillRect(140, 430, 400, 1);
      
      // Contact Grid
      const drawContact = (label, val, x, y) => {
        if (!val) return;
        ctx.font = `18px ${FONTS.sans}`;
        ctx.fillStyle = colors.muted;
        ctx.fillText(label, x, y);
        ctx.fillStyle = colors.text;
        ctx.fillText(val, x + 50, y);
      };
      
      let y1 = 480;
      let y2 = 530;
      
      drawContact('T.', phone, 140, y1);
      drawContact('E.', email, 440, y1);
      drawContact('W.', website, 140, y2);
      drawContact('L.', location, 440, y2);
      
      // Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          const logoSize = 80;
          ctx.drawImage(logo, width - 80 - logoSize, 80, logoSize, logoSize);
        } catch (e) {
          console.error('Error drawing logo', e);
        }
      }
      
    } else {
      // Back
      if (company) {
        ctx.fillStyle = colors.text;
        ctx.font = `bold 34px ${FONTS.sans}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(company.toUpperCase(), width / 2, height / 2 - 160);
      }
      
      drawQRCode(ctx, website || 'https://example.com', width / 2 - 120, height / 2 - 120, 240, colors.text, colors.bg || '#FAFAFA');
      
      if (website) {
        ctx.fillStyle = colors.muted;
        ctx.font = `20px ${FONTS.sans}`;
        ctx.textAlign = 'center';
        ctx.fillText(website, width / 2, height / 2 + 180);
      }
    }
  }
};
