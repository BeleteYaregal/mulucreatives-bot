const { 
  drawRoundedRect, 
  fitText, 
  loadImageFromBuffer, 
  drawGradientRect, 
  drawIconBadge,
  drawPhoneIcon,
  drawTelegramIcon,
  drawEmailIcon,
  drawLocationIcon,
  drawCheckIcon,
  drawQRCode 
} = require('../../utils/image');

module.exports = {
  name: 'Modern Corporate (Abel Style)',
  render: async function(canvas, ctx, data) {
    // Determine if front or back rendering is requested
    const side = data.side || 'front';
    const width = canvas.width;   // 1400
    const height = canvas.height; // 800

    const primaryColor = data.colors?.primary || '#1E60D5'; // Electric Blue
    const darkBgColor   = data.colors?.bg || '#0B132B';      // Deep Midnight Navy
    const accentColor   = data.colors?.secondary || '#2563EB';

    const nameParts = (data.name || 'Abel Tesfaye').trim().split(' ');
    const firstName = nameParts[0] || 'Abel';
    const lastName  = nameParts.slice(1).join(' ') || 'Tesfaye';
    const jobTitle  = data.title || 'Graphic Designer';
    const company   = data.company || 'ABEL DESIGNS';
    const tagline   = data.tagline || 'Creative Solutions';
    const phone     = data.phone || '+251 912 345 678';
    const telegram  = data.telegram || '@abel_designs';
    const email     = data.email || 'abeltesfaye@gmail.com';
    const location  = data.location || 'Bole, Addis Ababa, Ethiopia';
    const services  = data.services || ['Logo Design', 'Business Card', 'Brand Identity', 'Web & Social Media Design'];

    if (side === 'front') {
      // -------------------------------------------------------------
      // FRONT SIDE
      // -------------------------------------------------------------

      // 1. Base Background - Crisp Off-White Card Surface
      ctx.fillStyle = '#FAFAFC';
      ctx.fillRect(0, 0, width, height);

      // Subtle texture noise / dots on light side
      ctx.fillStyle = 'rgba(0,0,0,0.015)';
      for (let i = 0; i < width * 0.55; i += 12) {
        for (let j = 0; j < height; j += 12) {
          if ((i + j) % 24 === 0) ctx.fillRect(i, j, 2, 2);
        }
      }

      // 2. Right Side Dark Area Polygon (Chevrons)
      // Layer 1: Electric Blue Accent Chevron
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.moveTo(width * 0.54, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(width * 0.44, height);
      ctx.lineTo(width * 0.59, height * 0.5);
      ctx.closePath();
      ctx.fill();

      // Layer 2: Main Dark Navy Area
      ctx.fillStyle = darkBgColor;
      ctx.beginPath();
      ctx.moveTo(width * 0.57, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(width * 0.47, height);
      ctx.lineTo(width * 0.62, height * 0.5);
      ctx.closePath();
      ctx.fill();

      // Rounded Card Outer Border Line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 40);
      ctx.stroke();

      // --- LEFT SIDE CONTENT ---
      const leftX = width * 0.08; // ~112px

      // Full Name
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      ctx.font = 'bold 54px Arial';
      const firstNameWidth = ctx.measureText(firstName + ' ').width;
      
      // First Name (Dark Slate)
      ctx.fillStyle = '#1E293B';
      ctx.fillText(firstName + ' ', leftX, 160);
      
      // Last Name (Electric Blue)
      ctx.fillStyle = primaryColor;
      ctx.fillText(lastName, leftX + firstNameWidth, 160);

      // Job Title
      ctx.font = '500 32px Arial';
      ctx.fillStyle = '#475569';
      ctx.fillText(jobTitle, leftX, 215);

      // Underline Accent Bar
      ctx.fillStyle = primaryColor;
      ctx.fillRect(leftX, 235, 120, 6);

      // Contact Items List
      const contactStartY = 330;
      const spacingY = 90;
      const iconRadius = 26;
      const iconX = leftX + iconRadius;
      const textX = leftX + iconRadius * 2 + 24;

      // Contact Item 1: Phone
      drawIconBadge(ctx, iconX, contactStartY, iconRadius, primaryColor, (c, x, y, s) => drawPhoneIcon(c, x, y, s));
      ctx.font = '500 28px Arial';
      ctx.fillStyle = '#1E293B';
      ctx.fillText(phone, textX, contactStartY + 9);

      // Contact Item 2: Telegram
      const y2 = contactStartY + spacingY;
      drawIconBadge(ctx, iconX, y2, iconRadius, primaryColor, (c, x, y, s) => drawTelegramIcon(c, x, y, s));
      ctx.fillText(telegram, textX, y2 + 9);

      // Contact Item 3: Email
      const y3 = contactStartY + spacingY * 2;
      drawIconBadge(ctx, iconX, y3, iconRadius, primaryColor, (c, x, y, s) => drawEmailIcon(c, x, y, s));
      ctx.fillText(email, textX, y3 + 9);

      // Contact Item 4: Location
      const y4 = contactStartY + spacingY * 3;
      drawIconBadge(ctx, iconX, y4, iconRadius, primaryColor, (c, x, y, s) => drawLocationIcon(c, x, y, s));
      ctx.fillText(location, textX, y4 + 9);


      // --- RIGHT SIDE CONTENT (Logo & Branding) ---
      const rightCenterX = width * 0.81;

      if (data.logoBuffer) {
        const logoImg = await loadImageFromBuffer(data.logoBuffer);
        if (logoImg) {
          ctx.drawImage(logoImg, rightCenterX - 90, 220, 180, 180);
        }
      } else {
        // Draw Stylized Vector Logo Icon (Chevron 'A' Mark from reference image)
        ctx.save();
        ctx.translate(rightCenterX, 290);
        
        ctx.lineWidth = 32;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer chevron leg (blue)
        ctx.strokeStyle = primaryColor;
        ctx.beginPath();
        ctx.moveTo(-60, 80);
        ctx.lineTo(0, -60);
        ctx.lineTo(60, 80);
        ctx.stroke();

        // Inner accent diagonal bar
        ctx.strokeStyle = '#60A5FA';
        ctx.beginPath();
        ctx.moveTo(-20, 30);
        ctx.lineTo(35, -25);
        ctx.stroke();

        ctx.restore();
      }

      // Brand Name
      ctx.textAlign = 'center';
      ctx.font = 'bold 44px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(company.toUpperCase(), rightCenterX, 470);

      // Tagline
      ctx.font = '300 24px Arial';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(tagline, rightCenterX, 520);

      // Accent bar under tagline
      ctx.fillStyle = primaryColor;
      ctx.fillRect(rightCenterX - 40, 545, 80, 4);

    } else {
      // -------------------------------------------------------------
      // BACK SIDE
      // -------------------------------------------------------------

      // 1. Base Background - Crisp Off-White Right Side
      ctx.fillStyle = '#FAFAFC';
      ctx.fillRect(0, 0, width, height);

      // 2. Left Side Dark Area Polygon (Inverted Chevrons)
      // Layer 1: Electric Blue Accent
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width * 0.54, 0);
      ctx.lineTo(width * 0.39, height * 0.5);
      ctx.lineTo(width * 0.44, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Layer 2: Main Dark Navy
      ctx.fillStyle = darkBgColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width * 0.51, 0);
      ctx.lineTo(width * 0.36, height * 0.5);
      ctx.lineTo(width * 0.41, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // World map dotted grid texture on dark side
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let r = 50; r < height - 50; r += 16) {
        for (let c = 50; c < width * 0.42; c += 16) {
          if ((r * 7 + c * 13) % 29 < 12) {
            ctx.beginPath();
            ctx.arc(c, r, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Outer Border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 40);
      ctx.stroke();

      // --- LEFT SIDE CONTENT (Slogan & Motto) ---
      const darkCenterX = width * 0.22;

      ctx.textAlign = 'left';
      ctx.font = '300 46px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('We Design', darkCenterX - 100, 320);

      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = '#60A5FA';
      ctx.fillText('Your Success', darkCenterX - 100, 385);

      // Line
      ctx.fillStyle = primaryColor;
      ctx.fillRect(darkCenterX - 100, 420, 70, 5);

      // Motto
      ctx.font = '500 24px Arial';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Creative  •  Professional  •  Reliable', darkCenterX - 100, 480);

      // --- RIGHT SIDE CONTENT (QR Code & Services) ---
      const rightX = width * 0.58;

      // QR Code Box
      const qrSize = 180;
      const qrX = rightX + 160;
      const qrY = 160;
      const targetUrl = data.website || `https://t.me/${telegram.replace('@', '')}`;
      drawQRCode(ctx, targetUrl, qrX, qrY, qrSize, primaryColor, '#FFFFFF');

      // Services List with Checkmark Badges
      const servicesStartY = 400;
      const serviceSpacing = 65;
      const checkRadius = 20;

      services.forEach((service, index) => {
        const sy = servicesStartY + index * serviceSpacing;
        const checkX = rightX + 60;
        
        drawIconBadge(ctx, checkX, sy, checkRadius, primaryColor, (c, x, y, s) => drawCheckIcon(c, x, y, s));

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#1E293B';
        ctx.fillText(service, checkX + checkRadius * 2 + 16, sy + 8);
      });
    }
  }
};
