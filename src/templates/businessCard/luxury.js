const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'luxury',
  name: 'Gold & Midnight',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    const bg = '#121212';
    const gold = '#D4AF37';
    
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    
    // Gold border frame
    ctx.strokeStyle = gold;
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    if (side === 'front') {
      // Logo and company
      ctx.textAlign = 'center';
      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, width/2 - 60, 100, 120, 120);
      }
      
      ctx.fillStyle = gold;
      ctx.font = 'bold 36px "Times New Roman", serif';
      ctx.fillText((company || '').toUpperCase(), width/2, 260);

      // Name & Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 55px "Times New Roman", serif';
      ctx.fillText(name || '', width/2, 450);
      
      ctx.fillStyle = gold;
      ctx.font = '24px "Times New Roman", serif';
      ctx.fillText((title || '').toUpperCase(), width/2, 500);

      // Contact info bar at bottom
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px "Times New Roman", serif';
      const contacts = [phone, email, website].filter(Boolean).join('   |   ');
      ctx.fillText(contacts, width/2, height - 100);

    } else {
      // Back side
      ctx.fillStyle = gold;
      ctx.fillRect(width/2 - 160, height/2 - 160, 320, 320); // Gold QR box
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 30px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(tagline || 'Excellence in every detail', width/2, height/2 + 220);
    }
  }
};
