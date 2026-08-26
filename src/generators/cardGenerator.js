const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const colorSchemes = require('../data/colorSchemes');

// Import all 4 templates
const templates = {
  modern: require('../templates/cards/modern'),
  classic: require('../templates/cards/classic'),
  minimal: require('../templates/cards/minimal'),
  bold: require('../templates/cards/bold'),
};

const DEFAULT_COLORS = { primary: '#1E60D5', secondary: '#2563EB', accent: '#60A5FA', bg: '#0B132B', text: '#FFFFFF' };

/**
 * Generate high-resolution 300 DPI business card images (Front & Back)
 * @param {Object} data - { name, title, company, phone, email, telegram, location, tagline, services, logoBuffer }
 * @param {string} templateName - 'modern' | 'classic' | 'minimal' | 'bold'
 * @param {string|Object} colors - color scheme name ('ocean') or color object
 * @returns {Promise<{ front: Buffer, back: Buffer, preview: Buffer }>}
 */
async function generateCard(data, templateName = 'modern', colors = null) {
  const width = 1400;  // 300 DPI high-res printable width
  const height = 800;  // 300 DPI high-res printable height

  const template = templates[templateName] || templates.modern;

  // Resolve color scheme name to object
  let resolvedColors = DEFAULT_COLORS;
  if (typeof colors === 'string' && colorSchemes[colors]) {
    resolvedColors = colorSchemes[colors];
  } else if (typeof colors === 'object' && colors !== null) {
    resolvedColors = colors;
  }

  // 1. Render Front Side
  const frontCanvas = createCanvas(width, height);
  const frontCtx = frontCanvas.getContext('2d');
  const frontData = { ...data, side: 'front', colors: resolvedColors };
  await template.render(frontCanvas, frontCtx, frontData);
  const frontBuffer = frontCanvas.toBuffer('image/png');

  // 2. Render Back Side
  const backCanvas = createCanvas(width, height);
  const backCtx = backCanvas.getContext('2d');
  const backData = { ...data, side: 'back', colors: resolvedColors };
  await template.render(backCanvas, backCtx, backData);
  const backBuffer = backCanvas.toBuffer('image/png');

  // 3. Render Combined Presentation Showcase Preview (Front & Back Stacked)
  const prevWidth = 1500;
  const prevHeight = 1750;
  const prevCanvas = createCanvas(prevWidth, prevHeight);
  const prevCtx = prevCanvas.getContext('2d');

  // Clean soft studio backdrop
  prevCtx.fillStyle = '#EBECEE';
  prevCtx.fillRect(0, 0, prevWidth, prevHeight);

  const frontImg = await loadImage(frontBuffer);
  const backImg = await loadImage(backBuffer);

  const cardW = 1300;
  const cardH = 742;
  const cardX = (prevWidth - cardW) / 2;

  // Draw Front with Soft Drop Shadow
  prevCtx.save();
  prevCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  prevCtx.shadowBlur = 40;
  prevCtx.shadowOffsetY = 20;
  prevCtx.drawImage(frontImg, cardX, 80, cardW, cardH);
  prevCtx.restore();

  // Draw Back with Soft Drop Shadow
  prevCtx.save();
  prevCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  prevCtx.shadowBlur = 40;
  prevCtx.shadowOffsetY = 20;
  prevCtx.drawImage(backImg, cardX, 900, cardW, cardH);
  prevCtx.restore();

  const previewBuffer = prevCanvas.toBuffer('image/png');

  return {
    front: frontBuffer,
    back: backBuffer,
    preview: previewBuffer
  };
}

module.exports = { generateCard, templates };
