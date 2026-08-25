const { registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
  FONT_PRIMARY: 'Arial',       // Clean sans-serif
  FONT_HEADING: 'Georgia',     // Elegant serif  
  FONT_MONO: 'Courier New',    // Monospace
  FONT_DISPLAY: 'Segoe UI',    // Display/modern
  registerFonts: function() {
    const fontsDir = path.join(__dirname, '..', '..', 'fonts');
    if (fs.existsSync(fontsDir)) {
      // Logic to register custom fonts if available.
      // e.g. registerFont(path.join(fontsDir, 'CustomFont.ttf'), { family: 'CustomFont' });
    }
  }
};
