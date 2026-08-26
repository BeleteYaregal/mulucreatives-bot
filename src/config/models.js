/**
 * AI Model Configuration for MuluCreatives Platform
 * Allows dynamic configuration of models via Environment Variables
 */

module.exports = {
  // High-End Image Generation Model for Background Textures & Abstract Art
  BUSINESS_CARD_IMAGE_MODEL: process.env.BUSINESS_CARD_IMAGE_MODEL || 'gemini-3-pro-image',

  // Standard Image Generation / Editing Model
  FLASH_IMAGE_MODEL: process.env.FLASH_IMAGE_MODEL || 'gemini-3.1-flash-image',

  // Low-Cost / Preview Image Model
  LITE_IMAGE_MODEL: process.env.LITE_IMAGE_MODEL || 'gemini-3.1-flash-lite-image'
};
