const { FONTS, drawQRCode, loadImageFromBuffer, fitText, drawPhoneIcon, drawEmailIcon, drawLocationIcon, drawTelegramIcon } = require('../../utils/image');

module.exports = {
  id: 'technology',
  name: '05 — Technology',
  category: 'technology',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Fallback fonts
    const fontSans = FONTS?.sans || '"Liberation Sans", "DejaVu Sans", sans-serif';
    
    const themeBg = colors.bg || '#0A192F'; // Dark Navy/Slate
    const themeAccent = colors.secondary || '#64FFDA'; // Teal/cyan glow accent
    const textDark = '#0F172A';
    const textMuted = '#64748B';
    
    ctx.save();
    
    // Low-poly node coordinates (deterministic for reproducibility)
    const polyNodes = [
      { x: 100, y: 150 }, { x: 300, y: 80 }, { x: 250, y: 350 }, { x: 50, y: 500 },
      { x: 150, y: 700 }, { x: 450, y: 650 }, { x: 400, y: 450 }, { x: 550, y: 200 },
      { x: 750, y: 100 }, { x: 800, y: 300 }, { x: 680, y: 550 }, { x: 950, y: 180 },
      { x: 1100, y: 90 }, { x: 1250, y: 300 }, { x: 1050, y: 480 }, { x: 900, y: 680 },
      { x: 1200, y: 600 }, { x: 1350, y: 450 }, { x: 1300, y: 720 }, { x: 600, y: 780 }
    ];
    
    // Helper to draw low-poly mesh background
    const drawPolyMesh = (gCtx, lineColor, nodeColor) => {
      gCtx.save();
      // Draw connection lines
      gCtx.strokeStyle = lineColor;
      gCtx.lineWidth = 1;
      for (let i = 0; i < polyNodes.length; i++) {
        const n1 = polyNodes[i];
        // Connect each node to nearby nodes (distance < 320)
        for (let j = i + 1; j < polyNodes.length; j++) {
          const n2 = polyNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 320) {
            gCtx.beginPath();
            gCtx.moveTo(n1.x, n1.y);
            gCtx.lineTo(n2.x, n2.y);
            gCtx.stroke();
          }
        }
      }
      
      // Draw small points
      gCtx.fillStyle = nodeColor;
      for (const n of polyNodes) {
        gCtx.beginPath();
        gCtx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        gCtx.fill();
      }
      gCtx.restore();
    };

    // Draw generic geometric corporate logo (overlapping triangles like Reference 1)
    const drawDefaultLogo = (gCtx, cx, cy, size, color) => {
      gCtx.save();
      gCtx.strokeStyle = color;
      gCtx.fillStyle = color;
      gCtx.lineWidth = size * 0.08;
      gCtx.lineJoin = 'round';
      
      // Draw stylized overlapping double triangles (like Reference 1)
      gCtx.beginPath();
      gCtx.moveTo(cx, cy - size / 2);
      gCtx.lineTo(cx + size / 2, cy + size / 3);
      gCtx.lineTo(cx + size / 4, cy + size / 3);
      gCtx.lineTo(cx, cy - size / 6);
      gCtx.lineTo(cx - size / 2, cy + size / 3);
      gCtx.closePath();
      gCtx.fill();
      
      // Draw inner accent chevron
      gCtx.beginPath();
      gCtx.moveTo(cx, cy - size / 10);
      gCtx.lineTo(cx + size / 5, cy + size / 4);
      gCtx.lineTo(cx - size / 5, cy + size / 4);
      gCtx.closePath();
      gCtx.fillStyle = themeAccent;
      gCtx.fill();
      
      gCtx.restore();
    };

    if (side === 'front') {
      // --- Front Brand Cover Side ---
      // Solid brand background color (e.g. Teal or Navy)
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, width, height);

      // Draw faint white poly mesh background
      drawPolyMesh(ctx, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.12)');

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, centerX - 55, centerY - 150, 110, 110);
        } catch (e) {
          drawDefaultLogo(ctx, centerX, centerY - 90, 100, '#FFFFFF');
        }
      } else {
        drawDefaultLogo(ctx, centerX, centerY - 90, 100, '#FFFFFF');
      }

      // Company Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 32px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText((company || 'COMPANY NAME').toUpperCase(), centerX, centerY + 30);

      // Tagline
      if (tagline || data.tagline) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = `16px ${fontSans}`;
        ctx.fillText((tagline || data.tagline || 'SLOGAN HERE').toUpperCase(), centerX, centerY + 78);
      }

      // Stylized horizontal lines on left/right of center (like Reference 1)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      // Left line
      ctx.beginPath();
      ctx.moveTo(100, centerY + 45);
      ctx.lineTo(centerX - 170, centerY + 45);
      ctx.stroke();
      // Right line
      ctx.beginPath();
      ctx.moveTo(centerX + 170, centerY + 45);
      ctx.lineTo(width - 100, centerY + 45);
      ctx.stroke();

      // Website URL at bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = `18px ${fontSans}`;
      ctx.fillText(website || 'www.yourwebsite.com', centerX, height - 80);

    } else {
      // --- Back Details Side ---
      // Clean off-white background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // Draw faint dark poly mesh on back
      drawPolyMesh(ctx, 'rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.04)');

      const startX = 90;

      // Header: Name & Title
      ctx.fillStyle = themeBg;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const nameSize = fitText(ctx, name || 'YOUR NAME', 500, 38, fontSans);
      ctx.font = `bold ${nameSize}px ${fontSans}`;
      ctx.fillText(name || 'YOUR NAME', startX, 150);

      ctx.fillStyle = textMuted;
      ctx.font = `18px ${fontSans}`;
      ctx.fillText(title || 'SLOGAN HERE', startX, 212);

      // Horizontal Colored Accent Line beneath Header
      ctx.fillStyle = themeBg;
      ctx.fillRect(startX, 250, 420, 3);

      // Contacts list with colored icons inside square badges (like Reference 1)
      let contactY = 320;
      const stepY = 70;
      const iconSize = 22;

      const drawContactField = (iconDrawFn, label, value) => {
        if (!value) return;
        
        // Draw square icon badge
        ctx.fillStyle = themeBg;
        ctx.beginPath();
        ctx.roundRect(startX, contactY - 8, 40, 40, 8);
        ctx.fill();

        // Draw white icon inside badge
        iconDrawFn(ctx, startX + 20, contactY + 12, iconSize * 0.55, '#FFFFFF');

        ctx.fillStyle = textDark;
        ctx.font = `17px ${fontSans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, startX + 55, contactY + 12);

        // Thin divider line underneath
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, contactY + 36);
        ctx.lineTo(startX + 480, contactY + 36);
        ctx.stroke();

        contactY += stepY;
      };

      drawContactField(drawPhoneIcon, 'Phone', phone);
      drawContactField(drawEmailIcon, 'Email', email);
      drawContactField(drawLocationIcon, 'Office', location);

      // Top-Right: QR Code with thin border frame
      const qrSize = 190;
      const qrX = width - 90 - qrSize;
      const qrY = 120;
      drawQRCode(ctx, website || telegram || 'https://t.me/MuluCreativesbot', qrX, qrY, qrSize, themeBg, '#FFFFFF');

      // Bottom-Right: Repeating Logo & Mini Branding
      const miniLogoX = width - 90 - qrSize / 2;
      const miniLogoY = 480;
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, miniLogoX - 40, miniLogoY - 40, 80, 80);
        } catch (e) {
          drawDefaultLogo(ctx, miniLogoX, miniLogoY, 70, themeBg);
        }
      } else {
        drawDefaultLogo(ctx, miniLogoX, miniLogoY, 70, themeBg);
      }

      ctx.fillStyle = themeBg;
      ctx.font = `bold 22px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'COMPANY NAME').toUpperCase(), miniLogoX, miniLogoY + 55);
      
      ctx.fillStyle = textMuted;
      ctx.font = `13px ${fontSans}`;
      ctx.fillText((tagline || 'SLOGAN HERE').toUpperCase(), miniLogoX, miniLogoY + 80);

      // Bottom colored strip across full card width
      const footerH = 45;
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, height - footerH, width, footerH);

      // Centered URL in white inside bottom strip
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `17px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`•   ${website || 'www.yourwebsite.com'}   •`, width / 2, height - footerH / 2);
    }
    
    ctx.restore();
  }
};
