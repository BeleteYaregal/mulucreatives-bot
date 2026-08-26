const { FONTS, drawQRCode, loadImageFromBuffer, fitText, drawPhoneIcon, drawEmailIcon, drawLocationIcon, drawTelegramIcon } = require('../../utils/image');

module.exports = {
  id: 'modernCorporate',
  name: '03 — Modern Corporate',
  category: 'corporate',
  hasBack: true,
  
  render: async function(canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, logoBuffer, colors } = data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Fallback fonts
    const fontSans = FONTS?.sans || 'Arial, "Liberation Sans", "DejaVu Sans", sans-serif';
    
    const themeBg = colors.bg || '#008080'; // Primary theme background color (e.g. Teal or Orange)
    const themeAccent = colors.secondary || '#C9A050'; // Secondary gold/accent
    const textDark = '#1E293B'; // Slate neutral for text
    const textMuted = '#64748B'; // Faint gray
    
    ctx.save();
    
    // Draw generic geometric corporate logo
    const drawDefaultLogo = (gCtx, cx, cy, size, color) => {
      gCtx.save();
      gCtx.strokeStyle = color;
      gCtx.fillStyle = color;
      gCtx.lineWidth = size * 0.08;
      gCtx.lineJoin = 'round';
      
      // Draw stylized overlapping double triangles (like references 1 & 3)
      gCtx.beginPath();
      // Outer triangle shell
      gCtx.moveTo(cx, cy - size / 2);
      gCtx.lineTo(cx + size / 2, cy + size / 3);
      gCtx.lineTo(cx + size / 4, cy + size / 3);
      gCtx.lineTo(cx, cy - size / 6);
      gCtx.lineTo(cx - size / 4, cy + size / 3);
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
      // --- Front Cover Side ---
      // Solid brand background color (e.g. Teal or Orange)
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
          drawDefaultLogo(ctx, centerX, centerY - 90, 100, '#FFFFFF');
        }
      } else {
        drawDefaultLogo(ctx, centerX, centerY - 90, 100, '#FFFFFF');
      }

      // Company Name (Standard premium font size)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 40px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), centerX, centerY + 30);

      // Tagline (Standard premium font size)
      if (tagline || data.tagline) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = `20px ${fontSans}`;
        ctx.fillText((tagline || data.tagline || 'SLOGAN HERE').toUpperCase(), centerX, centerY + 85);
      }

      // Stylized horizontal lines on left/right of center (like reference images)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
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
      ctx.font = `22px ${fontSans}`;
      ctx.fillText(website || 'www.mulucreatives.com', centerX, height - 80);

    } else {
      // --- Back Details Side ---
      // Clean white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const startX = 90;

      // Header: Name & Title (Standard premium font sizes)
      ctx.fillStyle = themeBg;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const nameSize = fitText(ctx, name || 'Mark Smith', 500, 64, fontSans);
      ctx.font = `bold ${nameSize}px ${fontSans}`;
      ctx.fillText(name || 'Mark Smith', startX, 140);

      ctx.fillStyle = textMuted;
      ctx.font = `24px ${fontSans}`;
      ctx.fillText(title || 'Managing Director', startX, 215);

      // Horizontal Colored Accent Line beneath Header
      ctx.fillStyle = themeBg;
      ctx.fillRect(startX, 255, 420, 3);

      // Contacts list with colored icons (standard legible size)
      let contactY = 300;
      const stepY = 110;
      const iconSize = 26;

      const drawContactField = (iconDrawFn, label, value) => {
        if (!value) return;
        
        ctx.fillStyle = themeBg;
        // Draw the circular colored background or direct colored icon
        iconDrawFn(ctx, startX + 15, contactY + 12, iconSize * 0.55, themeBg);

        ctx.fillStyle = textDark;
        ctx.font = `24px ${fontSans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, startX + 50, contactY + 12);

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

      // Top-Right: QR Code with thin border frame (Aligned & centered)
      const qrSize = 220;
      const qrX = width - 90 - qrSize;
      const qrY = 120;
      drawQRCode(ctx, website || telegram || 'https://t.me/MuluCreativesbot', qrX, qrY, qrSize, themeBg, '#FFFFFF');

      // Bottom-Right: Repeating Logo & Mini Branding
      const miniLogoX = width - 90 - qrSize / 2;
      const miniLogoY = 460;
      if (logoBuffer) {
        try {
          const logo = await loadImageFromBuffer(logoBuffer);
          ctx.drawImage(logo, miniLogoX - 45, miniLogoY - 45, 90, 90);
        } catch (e) {
          drawDefaultLogo(ctx, miniLogoX, miniLogoY, 80, themeBg);
        }
      } else {
        drawDefaultLogo(ctx, miniLogoX, miniLogoY, 80, themeBg);
      }

      ctx.fillStyle = themeBg;
      ctx.font = `bold 28px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((company || 'MuluCreatives').toUpperCase(), miniLogoX, miniLogoY + 55);
      
      ctx.fillStyle = textMuted;
      ctx.font = `16px ${fontSans}`;
      ctx.fillText((tagline || 'SLOGAN HERE').toUpperCase(), miniLogoX, miniLogoY + 80);

      // Bottom colored strip across full card width
      const footerH = 45;
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, height - footerH, width, footerH);

      // Centered URL in white inside bottom strip
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `22px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`•   ${website || 'www.mulucreatives.com'}   •`, width / 2, height - footerH / 2);
    }
    
    ctx.restore();
  }
};
