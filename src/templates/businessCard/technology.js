const { fitText, drawQRCode } = require('../../utils/image');

module.exports = {
  id: 'technology',
  name: '05 — Technology',
  category: 'technology',
  hasBack: true,
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    const bg = '#0F172A'; // Dark Slate Neutral
    const textWhite = '#F8FAFC';
    const cyan = colors?.secondary || '#06B6D4';
    const gridLine = '#1E293B';
    const muted = '#94A3B8';

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Precise Technical Grid Background Lines
    ctx.strokeStyle = gridLine;
    ctx.lineWidth = 1;
    const gridStep = 100;
    for (let gx = 0; gx < width; gx += gridStep) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    if (side === 'front') {
      const startX = 100;

      // Small Geometric Brand Element & Technical Line
      ctx.fillStyle = cyan;
      ctx.fillRect(startX, 90, 16, 16);

      ctx.strokeStyle = cyan;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX + 30, 98);
      ctx.lineTo(startX + 200, 98);
      ctx.stroke();

      // Company Identity
      ctx.fillStyle = textWhite;
      ctx.font = 'bold 30px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), startX + 220, 106);

      // Name & Title
      ctx.fillStyle = textWhite;
      const nameSize = fitText(ctx, name || 'Abel Tesfaye', 650, 54, 'Arial');
      ctx.font = `bold ${nameSize}px "Arial", sans-serif`;
      ctx.fillText(name || 'Abel Tesfaye', startX, 300);

      ctx.fillStyle = cyan;
      ctx.font = 'bold 22px "Courier New", monospace';
      ctx.fillText(`// ${(title || 'Systems Architect').toUpperCase()}`, startX, 350);

      // Technical Monospaced Contact Block (Style C)
      ctx.fillStyle = muted;
      ctx.font = '18px "Courier New", monospace';
      let cy = 470;
      const stepY = 32;

      if (phone) {
        ctx.fillStyle = cyan;
        ctx.fillText('TEL:', startX, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(phone, startX + 60, cy);
        cy += stepY;
      }
      if (email) {
        ctx.fillStyle = cyan;
        ctx.fillText('EML:', startX, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(email, startX + 60, cy);
        cy += stepY;
      }
      if (website || telegram) {
        ctx.fillStyle = cyan;
        ctx.fillText('URL:', startX, cy);
        ctx.fillStyle = textWhite;
        ctx.fillText(website || telegram, startX + 60, cy);
      }

    } else {
      // --- Back Side ---
      const centerX = width / 2;
      const centerY = height / 2;

      const qrSize = 220;
      drawQRCode(ctx, telegram || website || 'https://t.me/MuluCreativesbot', centerX - qrSize / 2, centerY - 90, qrSize, cyan, bg);

      ctx.fillStyle = cyan;
      ctx.font = 'bold 32px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`// ${(company || 'MuluCreatives').toUpperCase()}`, centerX, centerY + 170);
    }

    ctx.restore();
  }
};
