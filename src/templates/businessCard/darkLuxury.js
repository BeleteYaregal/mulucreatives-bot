const { FONTS, drawQRCode, loadImageFromBuffer, hexToRgba, fitText } = require('../../utils/image');

module.exports = {
  id: 'darkLuxury',
  name: 'Dark Luxury',
  category: 'Business Card',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Background
    const bg = colors.bg || '#111111';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    
    // Radial gradient overlay
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
    gradient.addColorStop(0, hexToRgba(colors.secondary || '#D4AF37', 0.15));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Gold frame
    ctx.strokeStyle = colors.secondary || '#D4AF37';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, width - 90, height - 90);
    
    if (side === 'front') {
      // Company
      if (company) {
        ctx.fillStyle = colors.secondary || '#D4AF37';
        ctx.font = `30px ${FONTS.serif}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(company.toUpperCase(), width / 2, 100);
      }
      
      // Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          const logoSize = 60;
          ctx.drawImage(logo, width - 45 - 40 - logoSize, 45 + 40, logoSize, logoSize);
        } catch (e) {
          console.error('Error drawing logo', e);
        }
      }
      
      // Name
      ctx.fillStyle = '#FFFFF0'; // Ivory
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const nameSize = fitText(ctx, name || '', 700, 52, FONTS.serif);
      ctx.font = `bold ${nameSize}px ${FONTS.serif}`;
      ctx.fillText(name || '', width / 2, 320);
      
      // Title
      ctx.fillStyle = colors.secondary || '#D4AF37';
      ctx.font = `italic 22px ${FONTS.serif}`;
      ctx.fillText(title || '', width / 2, 370);
      
      // Contact
      const startY = height - 150;
      const drawContact = (label, val, x, y) => {
        if (!val) return;
        ctx.font = `18px ${FONTS.serif}`;
        ctx.textAlign = 'right';
        ctx.fillStyle = colors.secondary || '#D4AF37';
        ctx.fillText(label, x - 10, y);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFF0';
        ctx.fillText(val, x + 10, y);
      };
      
      drawContact('T ·', phone, width / 2 - 150, startY);
      drawContact('E ·', email, width / 2 + 150, startY);
      drawContact('W ·', website, width / 2 - 150, startY + 40);
      drawContact('L ·', location, width / 2 + 150, startY + 40);
      
    } else {
      // Back
      drawQRCode(ctx, website || 'https://example.com', width / 2 - 150, height / 2 - 170, 300, colors.secondary || '#D4AF37', bg);
      
      if (company) {
        ctx.fillStyle = colors.secondary || '#D4AF37';
        ctx.font = `30px ${FONTS.serif}`;
        ctx.textAlign = 'center';
        ctx.fillText(company.toUpperCase(), width / 2, height - 120);
      }
    }
  }
};
