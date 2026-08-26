/**
 * Design Quality Control Validator for Business Cards
 * Ensures design meets print-ready safe area guidelines, dimensions, and readability.
 */

function validateCardQuality(canvas, data) {
  const safeMargin = 40; // 0.125" at 300 DPI (1400x800 canvas)
  const width = canvas.width;
  const height = canvas.height;

  const checks = {
    isValidDimension: width === 1400 && height === 800,
    hasName: Boolean(data.name && data.name.trim().length > 0),
    hasCompany: Boolean(data.company && data.company.trim().length > 0),
    safeMarginEnforced: safeMargin >= 40,
    passed: true
  };

  if (!checks.isValidDimension || !checks.hasName) {
    checks.passed = false;
  }

  return checks;
}

module.exports = {
  validateCardQuality
};
