const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'minimal',
  name: 'Ultra Minimalist',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const dark = '#111111';
    
    if (side === 'front') {
      // 2px vertical accent line
      ctx.fillStyle = dark;
      ctx.fillRect(400, 150, 2, 500);

      // Left column
      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, 100, 150, 150, 150);
      }
      ctx.fillStyle = dark;
      ctx.textAlign = 'left';
      ctx.font = 'bold 30px "Segoe UI", Arial';
      ctx.fillText(company || '', 100, 360);
      
      // Right column
      ctx.font = 'bold 75px "Segoe UI", Arial';
      ctx.fillText(name || '', 450, 220);
      
      ctx.fillStyle = '#777777';
      ctx.font = '25px "Segoe UI", Arial';
      ctx.fillText((title || '').toUpperCase(), 455, 270);

      ctx.fillStyle = dark;
      ctx.font = '22px "Segoe UI", Arial';
      let cy = 400;
      const cyStep = 45;
      
      const fields = [phone, email, website, telegram];
      fields.forEach(f => {
        if (f) {
          ctx.fillText(f, 455, cy);
          cy += cyStep;
        }
      });

    } else {
      // Back side
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1;
      ctx.strokeRect(width/2 - 150, height/2 - 150, 300, 300);

      ctx.fillStyle = dark;
      ctx.textAlign = 'center';
      ctx.font = '20px "Segoe UI", Arial';
      ctx.fillText(website || email || '', width/2, height/2 + 200);
    }
  }
};
