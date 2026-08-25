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

const DEFAULT_COLORS = { primary: '#0077B6', secondary: '#00B4D8', accent: '#CAF0F8', bg: '#023E8A', text: '#FFFFFF' };

/**
 * Generate a business card image
 * @param {Object} data - { name, title, company, phone, email, photoBuffer, logoBuffer }
 * @param {string} templateName - 'modern' | 'classic' | 'minimal' | 'bold'
 * @param {string|Object} colors - color scheme name ('ocean') or color object
 * @returns {Promise<Buffer>} PNG buffer
 */
async function generateCard(data, templateName = 'modern', colors = null) {
  const canvas = createCanvas(1050, 600);
  const ctx = canvas.getContext('2d');
  
  const template = templates[templateName] || templates.modern;

  // Resolve color scheme name to object
  let resolvedColors = DEFAULT_COLORS;
  if (typeof colors === 'string' && colorSchemes[colors]) {
    resolvedColors = colorSchemes[colors];
  } else if (typeof colors === 'object' && colors !== null) {
    resolvedColors = colors;
  }

  const cardData = { ...data, colors: resolvedColors };
  
  await template.render(canvas, ctx, cardData);
  
  return canvas.toBuffer('image/png');
}

module.exports = { generateCard, templates };
