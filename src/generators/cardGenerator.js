const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const pdfService = require('../services/pdfService');
const schemes = require('../data/colorSchemes');
const db = require('../database/db');
const { validateCardQuality } = require('../utils/qualityControl');
const { FONTS } = require('../utils/image');

const templates = {
  swissMinimal: require('../templates/businessCard/swissMinimal'),
  darkLuxury: require('../templates/businessCard/darkLuxury'),
  modernCorporate: require('../templates/businessCard/modernCorporate'),
  editorial: require('../templates/businessCard/editorial'),
  technology: require('../templates/businessCard/technology'),
  creative: require('../templates/businessCard/modern'),          // Curved folder tab ribbon split layout (Reference 2)
  ethiopianModern: require('../templates/businessCard/ethiopianModern'),
  darkPremium: require('../templates/businessCard/corporate'),      // Interlocking squares corporate gold menu layout (Reference 3)
  elegantSerif: require('../templates/businessCard/elegantSerif'),
  executiveMonogram: require('../templates/businessCard/executiveMonogram'),
  // Fallback aliases for legacy template keys
  modern: require('../templates/businessCard/modern'),
  luxury: require('../templates/businessCard/darkLuxury'),
  corporate: require('../templates/businessCard/corporate'),
  minimal: require('../templates/businessCard/swissMinimal'),
  elegant: require('../templates/businessCard/elegantSerif')
};

/**
 * Generates a high-definition print-ready business card (front, back, preview, PDF).
 * @param {Object} data - Card data.
 * @param {string} templateName - Name of the template to use.
 * @param {string} colorName - Name of the color scheme to use.
 * @returns {Promise<Object>} - Contains buffers and paths.
 */
async function generateCard(data, templateName = 'swissMinimal', colorName = 'obsidian_ivory') {
  const template = templates[templateName] || templates.swissMinimal;
  const colors = schemes[colorName] || schemes.obsidian_ivory;
  // Ensure logoBuffer is properly passed down in templateData
  const templateData = { ...data, colors };

  const cardWidth = 1400;
  const cardHeight = 800;

  // 1. Front Canvas
  const frontCanvas = createCanvas(cardWidth, cardHeight);
  const frontCtx = frontCanvas.getContext('2d');
  await template.render(frontCanvas, frontCtx, { ...templateData, side: 'front' });
  const frontBuffer = frontCanvas.toBuffer('image/png');

  // Quality Control check on front canvas
  validateCardQuality(frontCanvas, data);

  // 2. Back Canvas (if template supports back side)
  let backBuffer = null;
  if (template.hasBack !== false) {
    try {
      const backCanvas = createCanvas(cardWidth, cardHeight);
      const backCtx = backCanvas.getContext('2d');
      await template.render(backCanvas, backCtx, { ...templateData, side: 'back' });
      backBuffer = backCanvas.toBuffer('image/png');
    } catch (e) {
      console.error("Error rendering back side:", e);
    }
  }

  // 3. Preview Canvas (Presentation Stacked Showcase)
  const previewCanvas = createCanvas(1500, 1750);
  const previewCtx = previewCanvas.getContext('2d');
  
  // Subtle gradient background
  const bgGrad = previewCtx.createLinearGradient(0, 0, 0, 1750);
  bgGrad.addColorStop(0, '#E8ECF1');
  bgGrad.addColorStop(1, '#D1D8E0');
  previewCtx.fillStyle = bgGrad;
  previewCtx.fillRect(0, 0, 1500, 1750);

  const drawShadowAndCard = async (imgBuffer, x, y, width, height) => {
    const img = await loadImage(imgBuffer);
    previewCtx.save();
    
    // Draw shadow
    previewCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    previewCtx.shadowBlur = 40;
    previewCtx.shadowOffsetX = 0;
    previewCtx.shadowOffsetY = 20;
    
    // Draw rounded rect path and clip
    previewCtx.beginPath();
    const radius = 24;
    previewCtx.moveTo(x + radius, y);
    previewCtx.lineTo(x + width - radius, y);
    previewCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
    previewCtx.lineTo(x + width, y + height - radius);
    previewCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    previewCtx.lineTo(x + radius, y + height);
    previewCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
    previewCtx.lineTo(x, y + radius);
    previewCtx.quadraticCurveTo(x, y, x + radius, y);
    previewCtx.closePath();
    
    // Fill slightly white before drawing image to handle transparency if any
    previewCtx.fillStyle = '#FFFFFF';
    previewCtx.fill();
    
    previewCtx.clip();
    previewCtx.drawImage(img, x, y, width, height);
    previewCtx.restore();
  };

  // Draw Front & Back on Preview Showcase
  await drawShadowAndCard(frontBuffer, 50, 50, 1400, 800);
  if (backBuffer) {
    await drawShadowAndCard(backBuffer, 50, 900, 1400, 800);
  }

  // Add branding watermark text at the bottom
  previewCtx.fillStyle = '#8E9AA8'; // muted gray
  const fallbackFont = '"Liberation Sans", "DejaVu Sans", sans-serif';
  const watermarkFont = (FONTS && FONTS.sans) ? FONTS.sans : fallbackFont;
  previewCtx.font = `20px ${watermarkFont}`;
  previewCtx.textAlign = 'center';
  previewCtx.fillText('✨ MuluCreatives — Professional Design Studio', 750, 1735);

  const previewBuffer = previewCanvas.toBuffer('image/png');

  // Storage Paths
  const timestamp = Date.now();
  const generatedDir = path.resolve(__dirname, '../../storage/generated');
  const pdfDir = path.resolve(__dirname, '../../storage/pdf');

  if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

  const frontPath = path.join(generatedDir, `card_front_${timestamp}.png`);
  const backPath = backBuffer ? path.join(generatedDir, `card_back_${timestamp}.png`) : null;
  const pdfPath = path.join(pdfDir, `card_${timestamp}.pdf`);
  const previewPath = path.join(generatedDir, `card_preview_${timestamp}.png`);

  try {
    fs.writeFileSync(frontPath, frontBuffer);
    if (backBuffer) fs.writeFileSync(backPath, backBuffer);
    fs.writeFileSync(previewPath, previewBuffer);

    // Generate Print-Ready PDF via pdfService
    await pdfService.createBusinessCardPDF(frontBuffer, backBuffer, pdfPath, { 
      title: `${data.name || 'Business'} Card`
    });
  } catch (e) {
    console.error("Error saving card files or PDF:", e);
  }

  return {
    frontBuffer,
    backBuffer,
    previewBuffer,
    pdfPath,
    frontPath,
    backPath,
    previewPath
  };
}

module.exports = {
  generateCard,
  templates
};
