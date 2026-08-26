const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'elegant',
  name: 'Elegant Serif',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    const bg = '#FDFBF7';
    const accent = '#1B4332';
    
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.strokeRect(40, 40, width - 80, height - 80);

    if (side === 'front') {
      ctx.fillStyle = accent;
      ctx.textAlign = 'center';
      
      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, width/2 - 40, 80, 80, 80);
      }
      
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText((company || '').toUpperCase(), width/2, 200);

      ctx.fillStyle = '#222222';
      ctx.font = 'italic 60px Georgia, serif';
      ctx.fillText(name || '', width/2, 380);
      
      ctx.fillStyle = '#555555';
      ctx.font = '22px Georgia, serif';
      ctx.fillText((title || '').toUpperCase(), width/2, 430);

      // Contact row
      ctx.fillStyle = accent;
      ctx.font = '20px Georgia, serif';
      const contacts = [phone, email, website].filter(Boolean).join('   |   ');
      ctx.fillText(contacts, width/2, 600);
      if (location) {
        ctx.fillText(location, width/2, 650);
      }

    } else {
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = '#D8C3A5';
      ctx.lineWidth = 2;
      ctx.strokeRect(width/2 - 160, height/2 - 160, 320, 320); // QR box outline
      
      ctx.fillStyle = bg;
      ctx.fillRect(width/2 - 150, height/2 - 150, 300, 300); // QR box bg

      ctx.fillStyle = '#D8C3A5';
      ctx.textAlign = 'center';
      ctx.font = 'italic 28px Georgia, serif';
      ctx.fillText(tagline || '', width/2, height/2 + 220);
    }
  }
};
