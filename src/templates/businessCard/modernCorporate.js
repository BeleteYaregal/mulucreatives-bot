/**
 * 03 — Modern Corporate
 * Reference: Navy/Orange split design
 * Front: Dark navy bg + subtle corner chevrons + orange C-logo + company name + website
 * Back:  White top (name, address+pin icon, QR) + Navy bottom (phone+phone icon, email+envelope icon)
 */
const { FONTS, drawQRCode, loadImageFromBuffer, fitText } = require('../../utils/image');

// ─── Reusable SVG-style icon drawers ────────────────────────────────────────

function drawPhoneIconFilled(ctx, cx, cy, r, bg, fg) {
  ctx.save();
  ctx.fillStyle = fg;                         // orange circle
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  // handset shape in bg color
  ctx.strokeStyle = bg;
  ctx.lineWidth = r * 0.35;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - r * 0.1, cy + r * 0.15, r * 0.38, Math.PI * 1.15, Math.PI * 1.65);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + r * 0.1, cy - r * 0.15, r * 0.38, Math.PI * 0.15, Math.PI * 0.65);
  ctx.stroke();
  ctx.restore();
}

function drawEnvelopeIconFilled(ctx, cx, cy, r, bg, fg) {
  ctx.save();
  ctx.fillStyle = fg;                         // orange circle
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  // envelope rectangle
  const hw = r * 0.62, hh = r * 0.42;
  ctx.fillStyle = bg;
  ctx.fillRect(cx - hw, cy - hh, hw * 2, hh * 2);
  // envelope flap V
  ctx.strokeStyle = fg;
  ctx.lineWidth = r * 0.18;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy - hh);
  ctx.lineTo(cx, cy + hh * 0.15);
  ctx.lineTo(cx + hw, cy - hh);
  ctx.stroke();
  ctx.restore();
}

function drawPinIconFilled(ctx, cx, cy, r, bg, fg) {
  ctx.save();
  ctx.fillStyle = fg;                         // orange circle
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  // pin drop shape in bg
  const ps = r * 0.62;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(cx, cy - ps * 0.18, ps * 0.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - ps * 0.28, cy - ps * 0.05);
  ctx.lineTo(cx, cy + ps * 0.65);
  ctx.lineTo(cx + ps * 0.28, cy - ps * 0.05);
  ctx.closePath();
  ctx.fill();
  // inner dot
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.arc(cx, cy - ps * 0.18, ps * 0.19, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Draw the orange geometric C-logo (diamond frame with right gap)
function drawCLogo(ctx, cx, cy, size, color, navyBg) {
  ctx.save();
  const s = size;
  ctx.translate(cx, cy);

  // Outer rotated square → diamond
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = color;
  ctx.fillRect(-s * 0.52, -s * 0.52, s * 1.04, s * 1.04);
  // Hollow center
  ctx.fillStyle = navyBg;
  ctx.fillRect(-s * 0.28, -s * 0.28, s * 0.56, s * 0.56);
  // Cut right side → C shape
  ctx.fillRect(s * 0.04, -s * 0.6, s * 0.7, s * 1.2);
  ctx.restore();

  ctx.restore();
}

// Draw subtle corner chevron decorations (like the reference)
function drawCornerDecor(ctx, W, H, navyBg) {
  // Top-right layered triangles
  ctx.save();
  [[0.28, 0.25], [0.45, 0.42]].forEach(([wa, ha], i) => {
    ctx.globalAlpha = 0.18 - i * 0.05;
    ctx.fillStyle = i === 0 ? '#2d4272' : '#233058';
    ctx.beginPath();
    ctx.moveTo(W - W * wa, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, H * ha);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();

  // Bottom-left layered triangles
  ctx.save();
  [[0.28, 0.25], [0.45, 0.42]].forEach(([wa, ha], i) => {
    ctx.globalAlpha = 0.18 - i * 0.05;
    ctx.fillStyle = i === 0 ? '#2d4272' : '#233058';
    ctx.beginPath();
    ctx.moveTo(0, H - H * ha);
    ctx.lineTo(W * wa, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

// ─── Main template ───────────────────────────────────────────────────────────

module.exports = {
  id: 'modernCorporate',
  name: '03 — Modern Corporate',
  category: 'corporate',
  hasBack: true,

  render: async function (canvas, ctx, data) {
    const { side, name, title, company, phone, email, telegram, website, location, tagline, logoBuffer, colors } = data;
    const W = canvas.width;    // 1400
    const H = canvas.height;   // 800

    const fontSans = FONTS?.sans || '"Liberation Sans", "DejaVu Sans", Arial, sans-serif';

    // Fixed premium palette (matches reference, but respects color scheme secondary as accent)
    const navy   = colors.bg      || '#1B2C4B';
    const orange = colors.secondary || '#F5A32A';
    const white  = '#FFFFFF';
    const dark   = '#1B2C4B';
    const gray   = '#6B7280';

    ctx.save();

    // ── FRONT ──────────────────────────────────────────────────────────────
    if (side === 'front') {
      // Full navy background
      ctx.fillStyle = navy;
      ctx.fillRect(0, 0, W, H);

      // Corner chevron decorations
      drawCornerDecor(ctx, W, H, navy);

      const cx = W / 2;
      const logoY = H * 0.28;

      // Logo
      if (logoBuffer) {
        try {
          const img = await loadImageFromBuffer(logoBuffer);
          const ls = 110;
          ctx.drawImage(img, cx - ls / 2, logoY - ls / 2, ls, ls);
        } catch (_) {
          drawCLogo(ctx, cx, logoY, 44, orange, navy);
        }
      } else {
        drawCLogo(ctx, cx, logoY, 44, orange, navy);
      }

      // Company name — two weights: "COMPANY" thin + "NAME" bold
      const raw    = (company || 'COMPANY NAME').toUpperCase();
      const parts  = raw.split(' ');
      const word1  = parts[0] || 'COMPANY';
      const word2  = parts.slice(1).join(' ') || 'NAME';

      const fontSize = 40;
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';

      ctx.font = `300 ${fontSize}px ${fontSans}`;
      const w1 = ctx.measureText(word1 + '\u2009').width;     // thin-space
      ctx.font = `bold ${fontSize}px ${fontSans}`;
      const w2 = ctx.measureText(word2).width;
      const totalW = w1 + w2;
      const nameX  = cx - totalW / 2;
      const nameY  = logoY + 65;

      ctx.fillStyle = white;
      ctx.font = `300 ${fontSize}px ${fontSans}`;
      ctx.fillText(word1 + '\u2009', nameX, nameY);
      ctx.font = `bold ${fontSize}px ${fontSans}`;
      ctx.fillText(word2, nameX + w1, nameY);

      // Tagline
      ctx.fillStyle = orange;
      ctx.font = `16px ${fontSans}`;
      ctx.textAlign = 'center';
      ctx.fillText((tagline || 'TAGLINEGOESHERE').toUpperCase(), cx, nameY + fontSize + 12);

      // Website
      ctx.fillStyle = orange;
      ctx.font = `22px ${fontSans}`;
      ctx.fillText(website || 'www.yourwebsite.com', cx, nameY + fontSize + 60);

    // ── BACK ───────────────────────────────────────────────────────────────
    } else {
      const splitY = Math.round(H * 0.52);   // white top / navy bottom

      // White top section
      ctx.fillStyle = white;
      ctx.fillRect(0, 0, W, splitY);

      // Navy bottom section
      ctx.fillStyle = navy;
      ctx.fillRect(0, splitY, W, H - splitY);

      // Corner chevron on navy section (bottom-right)
      ctx.save();
      [[0.22, 0.55], [0.38, 0.80]].forEach(([wa, ha], i) => {
        ctx.globalAlpha = 0.18 - i * 0.05;
        ctx.fillStyle = i === 0 ? '#2d4272' : '#233058';
        ctx.beginPath();
        ctx.moveTo(W - W * wa, H);
        ctx.lineTo(W, splitY + (H - splitY) * ha);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      const padL = 80;

      // ── White section content ──────────────────────────────────────────

      // Name: bold first + normal last
      const nameParts = (name || 'Stephen Lawse').split(' ');
      const firstName  = nameParts[0]  || 'Stephen';
      const lastName   = nameParts.slice(1).join(' ') || 'Lawse';

      const nameSize = 56;
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'left';

      ctx.font = `bold ${nameSize}px ${fontSans}`;
      const fnW = ctx.measureText(firstName + ' ').width;

      const nameY = splitY * 0.20;
      ctx.fillStyle = dark;
      ctx.fillText(firstName + ' ', padL, nameY);

      ctx.font = `400 ${nameSize}px ${fontSans}`;
      ctx.fillStyle = dark;
      ctx.fillText(lastName, padL + fnW, nameY);

      // Title
      ctx.fillStyle = gray;
      ctx.font      = `24px ${fontSans}`;
      ctx.fillText(title || 'Art Director', padL, nameY + nameSize + 10);

      // QR code — right side of white section
      const qrSize = 170;
      const qrX    = W - padL - qrSize;
      const qrY    = (splitY - qrSize) / 2;
      drawQRCode(ctx, website || telegram || email || 'https://mulucreatives.com', qrX, qrY, qrSize, '#000000', white);

      // Address + pin icon — bottom of white section
      if (location) {
        const iconR  = 22;
        const addrY  = splitY - 90;
        const addrX  = padL + iconR * 2 + 14;

        // Break into two lines at first comma
        const parts  = location.split(',');
        const line1  = (parts[0] || location).trim();
        const line2  = parts.slice(1).join(',').trim();

        ctx.fillStyle = gray;
        ctx.font      = `20px ${fontSans}`;
        ctx.textBaseline = 'top';
        ctx.fillText(line1 + (line2 ? ',' : ''), addrX, addrY);
        if (line2) ctx.fillText(line2, addrX, addrY + 28);

        // Orange pin icon to the right of text
        const line1W = ctx.measureText(line1 + (line2 ? ',' : '')).width;
        drawPinIconFilled(ctx, addrX + Math.max(line1W, ctx.measureText(line2).width) + 28, addrY + 20, iconR, white, orange);
      }

      // ── Navy section content ───────────────────────────────────────────

      const iconR    = 24;
      const navyMid  = splitY + (H - splitY) / 2;
      const itemPadL = padL + iconR * 2 + 14;  // text starts after icon space

      let rowY = navyMid - 45;

      // Phone rows (can show two if phone has newline, or show telegram as second)
      const phones = [phone, telegram].filter(Boolean);
      phones.slice(0, 2).forEach((p, i) => {
        ctx.fillStyle = white;
        ctx.font      = `22px ${fontSans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(p, itemPadL, rowY + i * 38);
      });

      // Phone icon — to the right of the longest phone line
      if (phones.length > 0) {
        ctx.font = `22px ${fontSans}`;
        const maxW = Math.max(...phones.map(p => ctx.measureText(p).width));
        const iconX = itemPadL + maxW + 36;
        const iconCY = phones.length === 2 ? rowY + 19 : rowY;
        drawPhoneIconFilled(ctx, iconX, iconCY, iconR, navy, orange);
      }

      // Email row
      if (email) {
        const emailY = navyMid + 30;
        ctx.fillStyle = white;
        ctx.font      = `22px ${fontSans}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(email, itemPadL, emailY);

        // Envelope icon to the right
        ctx.font = `22px ${fontSans}`;
        const emW = ctx.measureText(email).width;
        drawEnvelopeIconFilled(ctx, itemPadL + emW + 36, emailY, iconR, navy, orange);
      }
    }

    ctx.restore();
  }
};
