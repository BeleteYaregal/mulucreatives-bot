const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const pdfService = require('../services/pdfService');
const schemes = require('../data/colorSchemes');
const db = require('../database/db');

const templates = {
  corporate: require('../templates/businessCard/corporate'),
  modern: require('../templates/businessCard/modern'),
  minimal: require('../templates/businessCard/minimal'),
  luxury: require('../templates/businessCard/luxury'),
  creative: require('../templates/businessCard/creative'),
  technology: require('../templates/businessCard/technology'),
  elegant: require('../templates/businessCard/elegant')
};

/**
 * Generates a business card (front, back, preview, PDF).
 * @param {Object} data - Card data.
 * @param {string} templateName - Name of the template to use.
 * @param {string} colorName - Name of the color scheme to use.
 * @returns {Promise<Object>} - Contains buffers and paths.
 */
async function generateCard(data, templateName, colorName) {
  const template = templates[templateName] || templates.modern;
  const colors = schemes[colorName] || schemes.ocean;
  const templateData = { ...data, colors };

  const cardWidth = 1400;
  const cardHeight = 800;

  // 1. Front Canvas
  const frontCanvas = createCanvas(cardWidth, cardHeight);
  const frontCtx = frontCanvas.getContext('2d');
  await template.render(frontCanvas, frontCtx, { ...templateData, side: 'front' });
  const frontBuffer = frontCanvas.toBuffer('image/png');

  // 2. Back Canvas (if template has back side)
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

  // 3. Preview Canvas (Combined with shadows)
  const previewCanvas = createCanvas(1500, 1750);
  const previewCtx = previewCanvas.getContext('2d');
  
  // Background
  previewCtx.fillStyle = '#F0F2F5';
  previewCtx.fillRect(0, 0, 1500, 1750);

  const drawShadowAndCard = async (imgBuffer, x, y, width, height) => {
    const img = await loadImage(imgBuffer);
    previewCtx.save();
    
    // Soft drop shadow
    previewCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    previewCtx.shadowBlur = 40;
    previewCtx.shadowOffsetX = 0;
    previewCtx.shadowOffsetY = 20;
    
    previewCtx.drawImage(img, x, y, width, height);
    previewCtx.restore();
  };

  // Draw Front
  await drawShadowAndCard(frontBuffer, 50, 50, 1400, 800);
  
  // Draw Back
  if (backBuffer) {
    await drawShadowAndCard(backBuffer, 50, 900, 1400, 800);
  }

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

  // Save files asynchronously
  try {
    fs.writeFileSync(frontPath, frontBuffer);
    if (backBuffer) fs.writeFileSync(backPath, backBuffer);
    fs.writeFileSync(previewPath, previewBuffer);

    // Generate PDF using pdfService
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
    backPath
  };
}

module.exports = {
  generateCard,
  templates
};
