const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Creates a print-ready PDF for a business card.
 * @param {Buffer} frontImageBuffer - Buffer containing the front image.
 * @param {Buffer|null} backImageBuffer - Buffer containing the back image.
 * @param {string} outputPath - Path to save the PDF.
 * @param {Object} metadata - Document metadata.
 * @returns {Promise<string>} - Resolves to the outputPath when done.
 */
function createBusinessCardPDF(frontImageBuffer, backImageBuffer, outputPath, metadata = {}) {
  return new Promise((resolve, reject) => {
    try {
      // 3.5" x 2" at 72 pt/inch -> 252 pt x 144 pt
      const doc = new PDFDocument({
        size: [252, 144],
        margin: 0,
        info: {
          Title: metadata.title || 'Business Card',
          Author: 'MuluCreatives',
          Subject: 'Printable Business Card'
        }
      });

      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Add Front Page
      if (frontImageBuffer) {
        doc.image(frontImageBuffer, 0, 0, { width: 252, height: 144 });
      }

      // Add Back Page
      if (backImageBuffer) {
        doc.addPage({ size: [252, 144], margin: 0 });
        doc.image(backImageBuffer, 0, 0, { width: 252, height: 144 });
      }

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  createBusinessCardPDF
};
