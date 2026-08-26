const { drawRoundedRect, drawCircularImage, fitText, loadImageFromBuffer, drawGradientRect, drawIconBadge, drawPhoneIcon, drawTelegramIcon, drawEmailIcon, drawLocationIcon, drawCheckIcon, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'technology',
  name: 'Tech Hexagon',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    const bg = '#0F172A';
    const teal = '#06B6D4';
    
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Tech Grid pattern (simplified)
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (side === 'front') {
      ctx.strokeStyle = teal;
      ctx.lineWidth = 3;
      ctx.strokeRect(100, 100, width - 200, height - 200);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.font = 'bold 60px "Courier New", monospace';
      ctx.fillText(name || '', 150, 250);
      
      ctx.fillStyle = teal;
      ctx.font = '30px "Courier New", monospace';
      ctx.fillText(title || '', 150, 310);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '22px "Courier New", monospace';
      let cy = 450;
      [phone, email, telegram, website].forEach(c => {
        if (c) {
          ctx.fillText(`> ${c}`, 150, cy);
          cy += 40;
        }
      });

      if (logoBuffer) {
        const logo = await loadImageFromBuffer(logoBuffer);
        ctx.drawImage(logo, width - 300, 150, 150, 150);
      }

    } else {
      ctx.fillStyle = teal;
      ctx.textAlign = 'center';
      ctx.font = 'bold 50px "Courier New", monospace';
      ctx.fillText(company || '', width/2, 200);
      
      ctx.strokeStyle = teal;
      ctx.lineWidth = 2;
      ctx.strokeRect(width/2 - 150, height/2 - 100, 300, 300);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px "Courier New", monospace';
      ctx.fillText('SYSTEM.CONNECTION.READY', width/2, height - 100);
    }
  }
};
