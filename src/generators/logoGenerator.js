const { createCanvas } = require('canvas');
const colorSchemes = require('../data/colorSchemes');

// Import all 6 templates
const templates = {
  monogram: require('../templates/logos/monogram'),
  wordmark: require('../templates/logos/wordmark'),
  icontext: require('../templates/logos/icontext'),
  badge: require('../templates/logos/badge'),
  geometric: require('../templates/logos/geometric'),
  gradient: require('../templates/logos/gradient'),
};

const DEFAULT_COLORS = { primary: '#0077B6', secondary: '#00B4D8', accent: '#CAF0F8' };

/**
 * Generate logo images
 * @param {Object} data - { brandName, tagline, colors (string or object), iconIndex }
 * @param {string} style - 'monogram' | 'wordmark' | 'icontext' | 'badge' | 'geometric' | 'gradient'
 * @returns {Promise<{standard: Buffer, transparent: Buffer, favicon: Buffer}>}
 */
async function generateLogo(data, style = 'monogram') {
  const template = templates[style] || templates.monogram;

  // Resolve color scheme name to object
  let resolvedColors = DEFAULT_COLORS;
  if (typeof data.colors === 'string' && colorSchemes[data.colors]) {
    resolvedColors = colorSchemes[data.colors];
  } else if (typeof data.colors === 'object' && data.colors !== null) {
    resolvedColors = data.colors;
  }
  const resolvedData = { ...data, colors: resolvedColors };
  
  // Standard (800x800 with white background)
  const stdCanvas = createCanvas(800, 800);
  const stdCtx = stdCanvas.getContext('2d');
  stdCtx.fillStyle = '#FFFFFF';
  stdCtx.fillRect(0, 0, 800, 800);
  await template.render(stdCanvas, stdCtx, resolvedData);
  const standard = stdCanvas.toBuffer('image/png');
  
  // Transparent (800x800, no background)
  const transCanvas = createCanvas(800, 800);
  const transCtx = transCanvas.getContext('2d');
  await template.render(transCanvas, transCtx, resolvedData);
  const transparent = transCanvas.toBuffer('image/png');
  
  // Favicon (128x128, no background)
  const favCanvas = createCanvas(128, 128);
  const favCtx = favCanvas.getContext('2d');
  favCtx.scale(128/800, 128/800);
  await template.render(favCanvas, favCtx, resolvedData);
  const favicon = favCanvas.toBuffer('image/png');
  
  return { standard, transparent, favicon };
}

module.exports = { generateLogo, templates };
