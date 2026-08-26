const { FONTS, drawQRCode, loadImageFromBuffer, fitText } = require('../../utils/image');

module.exports = {
  id: 'editorial',
  name: 'Editorial',
  category: 'Business Card',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, website, location, tagline, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Background
    const bg = colors.bg && colors.bg !== '#FFFFFF' && colors.bg !== '#000000' ? colors.bg : '#F7F4EF';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    
    if (side === 'front') {
      // Company
      if (company) {
        ctx.fillStyle = colors.secondary;
        ctx.font = `24px ${FONTS.serif}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(company, 80, 80);
        ctx.fillStyle = colors.muted || '#A8A29E';
        ctx.fillRect(80, 115, 60, 1);
      }
      
      // Name
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const nameSize = fitText(ctx, name || '', 700, 56, FONTS.serif);
      ctx.font = `bold ${nameSize}px ${FONTS.serif}`;
      ctx.fillText(name || '', 80, 340);
      
      // Title
      ctx.fillStyle = colors.muted;
      ctx.font = `italic 22px ${FONTS.serif}`;
      ctx.fillText(title || '', 80, 390);
      
      // Decorative rule
      ctx.fillStyle = '#D6D3D1';
      ctx.fillRect(80, 480, width - 160, 1);
      
      // Contact Items
      ctx.fillStyle = colors.text;
      ctx.font = `19px ${FONTS.serif}`;
      ctx.textAlign = 'center';
      
      const items = [phone, email, website].filter(Boolean);
      if (items.length > 0) {
        ctx.fillText(items.join('  /  '), width / 2, 540);
      }
      
      if (location) {
        ctx.fillText(location, width / 2, 580);
      }
      
      // Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          const logoSize = 70;
          ctx.drawImage(logo, width - 80 - logoSize, 80, logoSize, logoSize);
        } catch (e) {
          console.error('Error drawing logo', e);
        }
      }
      
    } else {
      // Back
      if (tagline) {
        ctx.fillStyle = colors.muted;
        ctx.font = `italic 24px ${FONTS.serif}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagline, width / 2, height / 2 - 180);
      }
      
      drawQRCode(ctx, website || 'https://example.com', width / 2 - 120, height / 2 - 120, 240, colors.text, bg);
      
      if (company) {
        ctx.fillStyle = colors.text;
        ctx.font = `bold 34px ${FONTS.serif}`;
        ctx.textAlign = 'center';
        ctx.fillText(company, width / 2, height - 100);
      }
    }
  }
};
