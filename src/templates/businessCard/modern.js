const { FONTS, drawQRCode, loadImageFromBuffer, fitText, drawPhoneIcon, drawEmailIcon, drawLocationIcon } = require('../../utils/image');

module.exports = {
  id: 'modern',
  name: '02 — Modern Chevron',
  category: 'modern',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, website, location, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Fallback fonts
    const fontSans = FONTS?.sans || '"Liberation Sans", "DejaVu Sans", sans-serif';
    
    const themeBg = colors.bg || '#1B4332'; // Dark green/dark slate
    const themeAccent = colors.secondary || '#52B788'; // Soft green accent
    const textDark = '#1E293B';
    const textMuted = '#64748B';
    
    ctx.save();
    
    // Draw geometric flower/clover logo (similar to Reference 2)
    const drawFlowerLogo = (gCtx, cx, cy, size, color) => {
      gCtx.save();
      gCtx.fillStyle = color;
      
      // Draw 6 petals as circles/ellipses
      const petals = 8;
      const radius = size * 0.28;
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        
        gCtx.beginPath();
        gCtx.arc(px, py, size * 0.2, 0, Math.PI * 2);
        gCtx.fill();
      }
      
      // Center circle
      gCtx.beginPath();
      gCtx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
      gCtx.fillStyle = '#FFFFFF';
      gCtx.fill();
      gCtx.restore();
    };

    if (side === 'front') {
      // --- Front Brand Cover Side ---
      // White canvas background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, centerX - 55, centerY - 150, 110, 110);
        } catch (e) {
          drawFlowerLogo(ctx, centerX, centerY - 90, 100, themeBg);
        }
      } else {
        drawFlowerLogo(ctx, centerX, centerY - 90, 100, themeBg);
      }

      // Company Name
      ctx.fillStyle = textDark;
      ctx.font = `bold 40px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(company || 'Larana, Inc.', centerX, centerY + 30);

      // Bottom dark panel
      const bottomPanelH = 140;
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, height - bottomPanelH, width, bottomPanelH);

      // Curved folder tab ribbon in the middle of the bottom panel (like Reference 2)
      ctx.fillStyle = themeAccent;
      const tabW = 400;
      const tabH = 50;
      const tabX = centerX - tabW / 2;
      const tabY = height - bottomPanelH - tabH + 10;
      
      ctx.beginPath();
      ctx.moveTo(tabX - 25, height - bottomPanelH + 10);
      ctx.bezierCurveTo(tabX - 5, height - bottomPanelH + 10, tabX - 5, tabY, tabX + 20, tabY);
      ctx.lineTo(tabX + tabW - 20, tabY);
      ctx.bezierCurveTo(tabX + tabW + 5, tabY, tabX + tabW + 5, height - bottomPanelH + 10, tabX + tabW + 25, height - bottomPanelH + 10);
      ctx.closePath();
      ctx.fill();

      // Website URL inside the tab
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 20px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(website || 'www.reallygreatsite.com', centerX, tabY + tabH / 2);

    } else {
      // --- Back Details Side ---
      // Left solid panel (40%)
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, 520, height);

      // Tab divider separator on the boundary (x=520, y=0 to height)
      ctx.fillStyle = themeAccent;
      ctx.fillRect(520, 0, 12, height);
      
      // Draw a curved tab shape in the middle of the divider strip (x=520, y=280 to 520)
      const tabY = 300;
      const tabH = 200;
      ctx.beginPath();
      ctx.moveTo(520 + 12, tabY - 30);
      ctx.bezierCurveTo(520 + 12, tabY - 5, 520 + 35, tabY, 520 + 35, tabY + 25);
      ctx.lineTo(520 + 35, tabY + tabH - 25);
      ctx.bezierCurveTo(520 + 35, tabY + tabH, 520 + 12, tabY + tabH + 5, 520 + 12, tabY + tabH + 30);
      ctx.closePath();
      ctx.fill();

      // White right content side
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(520 + 12, 0, width - (520 + 12), height);

      // Left panel content: Name & Title & Logo
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const nameSize = fitText(ctx, name || 'Avery Davis', 400, 48, fontSans);
      ctx.font = `bold ${nameSize}px ${fontSans}`;
      ctx.fillText(name || 'Avery Davis', 80, 160);

      ctx.fillStyle = themeAccent;
      ctx.font = `20px ${fontSans}`;
      ctx.fillText(title || 'Director', 80, 215);
      
      // Divider line in left panel
      ctx.fillStyle = themeAccent;
      ctx.fillRect(80, 250, 120, 2);

      // Logo on left panel
      const lY = 460;
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, 80, lY, 80, 80);
        } catch (e) {
          drawFlowerLogo(ctx, 120, lY + 40, 80, '#FFFFFF');
        }
      } else {
        drawFlowerLogo(ctx, 120, lY + 40, 80, '#FFFFFF');
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 28px ${fontSans}`;
      ctx.fillText(company || 'Larana, Inc.', 80, lY + 95);

      // Right Side Content (x=600): Contact details
      const startX = 600;
      let contactY = 200;
      const stepY = 120;
      const iconSize = 22;

      const drawContactField = (iconDrawFn, value) => {
        if (!value) return;

        // Draw icon badge (curved rectangular box background like Reference 2)
        ctx.fillStyle = themeAccent;
        ctx.beginPath();
        ctx.roundRect(startX, contactY - 10, 44, 44, 10);
        ctx.fill();

        // Draw white icon inside badge
        iconDrawFn(ctx, startX + 22, contactY + 12, iconSize * 0.55, '#FFFFFF');

        // Draw value text
        ctx.fillStyle = textDark;
        ctx.font = `20px ${fontSans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, startX + 65, contactY + 12);

        // Thin divider line underneath
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, contactY + 50);
        ctx.lineTo(width - 90, contactY + 50);
        ctx.stroke();

        contactY += stepY;
      };

      drawContactField(drawPhoneIcon, phone);
      drawContactField(drawEmailIcon, email || website);
      drawContactField(drawLocationIcon, location);
      
      // Draw QR Code on the right side if there's space (e.g. top right of right side)
      const qrSize = 130;
      drawQRCode(ctx, website || 'https://example.com', width - 90 - qrSize, 50, qrSize, themeBg, '#FFFFFF');
    }
    
    ctx.restore();
  }
};
