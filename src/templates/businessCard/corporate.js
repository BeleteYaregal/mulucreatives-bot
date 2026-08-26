const { FONTS, drawQRCode, loadImageFromBuffer, fitText, drawPhoneIcon, drawEmailIcon, drawLocationIcon, drawTelegramIcon } = require('../../utils/image');

module.exports = {
  id: 'corporate',
  name: '01 — Corporate Gold',
  category: 'corporate',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, services, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Fallback fonts
    const fontSans = FONTS?.sans || '"Liberation Sans", "DejaVu Sans", sans-serif';
    
    const themeBg = colors.bg || '#0F2027'; // Deep dark teal/slate background
    const themeAccent = colors.secondary || '#D4AF37'; // Gold accent
    const textDark = '#1E293B';
    const textMuted = '#64748B';
    
    ctx.save();
    
    // Draw interlocking geometric squares corporate logo (Reference 3)
    const drawSquaresLogo = (gCtx, cx, cy, size, color) => {
      gCtx.save();
      gCtx.strokeStyle = color;
      gCtx.lineWidth = size * 0.08;
      gCtx.lineJoin = 'miter';
      
      const hs = size / 3;
      
      // Left/Top square
      gCtx.strokeRect(cx - hs, cy - hs, hs * 1.5, hs * 1.5);
      
      // Right/Bottom square
      gCtx.strokeStyle = themeAccent;
      gCtx.strokeRect(cx - hs / 2, cy - hs / 2, hs * 1.5, hs * 1.5);
      
      gCtx.restore();
    };

    if (side === 'front') {
      // --- Front Cover Side ---
      // Solid brand background color
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Logo
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, centerX - 55, centerY - 150, 110, 110);
        } catch (e) {
          drawSquaresLogo(ctx, centerX, centerY - 90, 100, '#FFFFFF');
        }
      } else {
        drawSquaresLogo(ctx, centerX, centerY - 90, 100, '#FFFFFF');
      }

      // Company Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 38px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText((company || 'Larana, Inc.').toUpperCase(), centerX, centerY + 30);

      // Tagline
      if (tagline || data.tagline) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = `18px ${fontSans}`;
        ctx.fillText((tagline || data.tagline || 'SLOGAN HERE').toUpperCase(), centerX, centerY + 78);
      }

      // Stylized horizontal lines on left/right of center
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(100, centerY + 45);
      ctx.lineTo(centerX - 180, centerY + 45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + 180, centerY + 45);
      ctx.lineTo(width - 100, centerY + 45);
      ctx.stroke();

      // Bottom gold panel strip with core business verticals/services (Reference 3)
      const serviceBarH = 65;
      const serviceBarY = height - 140;
      ctx.fillStyle = themeAccent;
      ctx.fillRect(0, serviceBarY, width, serviceBarH);

      ctx.fillStyle = themeBg;
      ctx.font = `bold 16px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const sList = services || ['CONSTRUCTION', 'DEVELOPMENT', 'REAL ESTATE', 'CONSULTING'];
      const formattedServices = sList.slice(0, 4).join('   |   ');
      ctx.fillText(formattedServices, width / 2, serviceBarY + serviceBarH / 2);

      // Website URL at the very bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = `18px ${fontSans}`;
      ctx.fillText(website || 'www.yourwebsite.com', width / 2, height - 40);

    } else {
      // --- Back Details Side ---
      // Clean white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Left solid panel strip (contains contact details)
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, 520, height);

      // Tab divider separator on the boundary
      ctx.fillStyle = themeAccent;
      ctx.fillRect(520, 0, 10, height);

      const startX = 60;

      // Name & Title inside the left dark panel
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const nameSize = fitText(ctx, name || 'YOUR NAME', 400, 48, fontSans);
      ctx.font = `bold ${nameSize}px ${fontSans}`;
      ctx.fillText(name || 'YOUR NAME', startX, 120);

      ctx.fillStyle = themeAccent;
      ctx.font = `20px ${fontSans}`;
      ctx.fillText(title || 'SLOGAN HERE', startX, 175);

      // Divider line in left panel
      ctx.fillStyle = themeAccent;
      ctx.fillRect(startX, 210, 160, 2);

      // Contacts list inside the left dark panel with gold icons
      let contactY = 280;
      const stepY = 110;
      const iconSize = 22;

      const drawContactField = (iconDrawFn, value) => {
        if (!value) return;

        // Draw circular gold icon badge
        ctx.fillStyle = themeAccent;
        ctx.beginPath();
        ctx.arc(startX + 22, contactY + 22, 22, 0, Math.PI * 2);
        ctx.fill();

        // Draw dark icon inside badge
        iconDrawFn(ctx, startX + 22, contactY + 22, iconSize * 0.55, themeBg);

        // Draw value text in white
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `19px ${fontSans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, startX + 60, contactY + 22);

        // Thin divider line underneath
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, contactY + 60);
        ctx.lineTo(startX + 400, contactY + 60);
        ctx.stroke();

        contactY += stepY;
      };

      drawContactField(drawPhoneIcon, phone);
      drawContactField(drawEmailIcon, email || website);
      drawContactField(drawLocationIcon, location);

      // Right Side Content (White background)
      const rightCenterX = 520 + (width - 520) / 2;

      // Top-Right: QR Code with thin border frame
      const qrSize = 180;
      drawQRCode(ctx, website || telegram || 'https://t.me/MuluCreativesbot', rightCenterX - qrSize / 2, 100, qrSize, themeBg, '#FFFFFF');

      // Repeating Logo & Mini Branding on the right side
      const miniLogoY = 440;
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, rightCenterX - 45, miniLogoY - 45, 90, 90);
        } catch (e) {
          drawSquaresLogo(ctx, rightCenterX, miniLogoY, 80, themeBg);
        }
      } else {
        drawSquaresLogo(ctx, rightCenterX, miniLogoY, 80, themeBg);
      }

      ctx.fillStyle = themeBg;
      ctx.font = `bold 26px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'Larana, Inc.').toUpperCase(), rightCenterX, miniLogoY + 65);
      
      ctx.fillStyle = textMuted;
      ctx.font = `14px ${fontSans}`;
      ctx.fillText((tagline || 'SLOGAN HERE').toUpperCase(), rightCenterX, miniLogoY + 90);

      // Bottom colored strip across full card width
      const footerH = 45;
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, height - footerH, width, footerH);

      // Centered URL in white inside bottom strip
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `18px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`•   ${website || 'www.yourwebsite.com'}   •`, width / 2, height - footerH / 2);
    }
    
    ctx.restore();
  }
};
