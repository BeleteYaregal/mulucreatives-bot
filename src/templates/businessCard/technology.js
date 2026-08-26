const { FONTS, drawQRCode, loadImageFromBuffer, fitText } = require('../../utils/image');

module.exports = {
  id: 'technology',
  name: 'Technology',
  category: 'Business Card',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Background
    const bg = colors.bg || '#0F172A';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    
    // Dot grid
    ctx.fillStyle = '#1E293B';
    for (let x = 30; x < width; x += 60) {
      for (let y = 30; y < height; y += 60) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const cyan = colors.secondary || '#06B6D4';
    const white = '#FFFFFF';
    
    if (side === 'front') {
      // Top left accent
      ctx.fillStyle = cyan;
      ctx.fillRect(80, 80, 12, 12);
      ctx.fillRect(100, 85, 100, 2);
      
      // Company
      if (company) {
        ctx.fillStyle = white;
        ctx.font = `28px ${FONTS.mono}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(company, width - 80, 80);
      }
      
      // Name
      ctx.fillStyle = white;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const nameSize = fitText(ctx, name || '', 700, 52, FONTS.sans);
      ctx.font = `bold ${nameSize}px ${FONTS.sans}`;
      ctx.fillText(name || '', 80, 300);
      
      // Title
      ctx.fillStyle = cyan;
      ctx.font = `20px ${FONTS.mono}`;
      ctx.fillText(`// ${title || ''}`, 80, 350);
      
      // Contact block
      const startY = 480;
      const drawContact = (label, val, x, y) => {
        if (!val) return;
        ctx.font = `18px ${FONTS.mono}`;
        ctx.fillStyle = cyan;
        ctx.fillText(label, x, y);
        ctx.fillStyle = white;
        ctx.fillText(val, x + 60, y);
      };
      
      drawContact('TEL:', phone, 80, startY);
      drawContact('EML:', email, 400, startY);
      drawContact('URL:', website, 80, startY + 40);
      drawContact('LOC:', location, 400, startY + 40);
      
      // Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          const logoSize = 60;
          ctx.drawImage(logo, width - 80 - logoSize, height - 80 - logoSize, logoSize, logoSize);
        } catch (e) {
          console.error('Error drawing logo', e);
        }
      }
      
    } else {
      // Back
      drawQRCode(ctx, website || 'https://example.com', width / 2 - 120, height / 2 - 140, 240, cyan, bg);
      
      if (company) {
        ctx.fillStyle = white;
        ctx.font = `24px ${FONTS.mono}`;
        ctx.textAlign = 'center';
        ctx.fillText(`// ${company}`, width / 2, height / 2 + 150);
      }
    }
  }
};
