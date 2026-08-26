const { FONTS, drawQRCode, loadImageFromBuffer, fitText } = require('../../utils/image');

module.exports = {
  id: 'modernCorporate',
  name: 'Modern Corporate',
  category: 'Business Card',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    if (side === 'front') {
      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // Left side panel
      ctx.fillStyle = colors.bg || '#1E293B';
      ctx.fillRect(0, 0, 100, height);
      
      // Thin accent line
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(100, 0, 4, height);
      
      // Logo in panel
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          const logoSize = 60;
          ctx.drawImage(logo, 20, 80, logoSize, logoSize);
        } catch (e) {
          console.error('Error drawing logo', e);
        }
      }
      
      // Company
      if (company) {
        ctx.fillStyle = colors.primary || '#3B82F6';
        ctx.fillRect(140, 80, 4, 30);
        ctx.fillStyle = colors.text;
        ctx.font = `bold 30px ${FONTS.sans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(company, 160, 80);
      }
      
      // Name
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const nameSize = fitText(ctx, name || '', 700, 50, FONTS.sans);
      ctx.font = `bold ${nameSize}px ${FONTS.sans}`;
      ctx.fillText(name || '', 140, 320);
      
      // Title
      ctx.fillStyle = colors.secondary;
      ctx.font = `22px ${FONTS.sans}`;
      ctx.fillText((title || '').toUpperCase(), 140, 360);
      
      // Contact
      const drawContact = (label, val, x, y) => {
        if (!val) return;
        ctx.font = `bold 18px ${FONTS.sans}`;
        ctx.fillStyle = colors.muted;
        ctx.fillText(label, x, y);
        ctx.font = `18px ${FONTS.sans}`;
        ctx.fillStyle = colors.text;
        ctx.fillText(val, x + 70, y);
      };
      
      let startY = 500;
      drawContact('Phone:', phone, 140, startY);
      drawContact('Email:', email, 540, startY);
      drawContact('Web:', website, 140, startY + 40);
      drawContact('Office:', location, 540, startY + 40);
      
    } else {
      // Back
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(0, 0, width, height);
      
      drawQRCode(ctx, website || 'https://example.com', width / 2 - 120, height / 2 - 140, 240, colors.secondary, '#FFFFFF');
      
      if (company) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold 34px ${FONTS.sans}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(company, width / 2, height / 2 + 150);
      }
    }
  }
};
