/**
 * Validates and formats a phone number, especially Ethiopian numbers
 * @param {string} phone
 * @returns {{valid: boolean, formatted: string}}
 */
function validatePhone(phone) {
  if (!phone) return { valid: false, formatted: '' };
  
  // Remove spaces, dashes, etc
  let cleaned = phone.replace(/[\s-()]/g, '');
  
  // Ethiopian mobile numbers
  if (/^0[79]\d{8}$/.test(cleaned)) {
    return { 
      valid: true, 
      formatted: `+251 ${cleaned.substring(1, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5, 9)}` 
    };
  }
  
  if (/^\+251[79]\d{8}$/.test(cleaned)) {
    return { 
      valid: true, 
      formatted: `+251 ${cleaned.substring(4, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8, 12)}` 
    };
  }
  
  // Fallback for other generic phone numbers (at least 7 digits)
  if (/^\+?[0-9]{7,15}$/.test(cleaned)) {
    return { valid: true, formatted: cleaned };
  }
  
  return { valid: false, formatted: phone };
}

/**
 * Validates an email address
 * @param {string} email
 * @returns {{valid: boolean, formatted: string}}
 */
function validateEmail(email) {
  if (!email) return { valid: false, formatted: '' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleaned = email.trim().toLowerCase();
  
  if (emailRegex.test(cleaned)) {
    return { valid: true, formatted: cleaned };
  }
  return { valid: false, formatted: email };
}

/**
 * Validates and formats a website URL
 * @param {string} url
 * @returns {{valid: boolean, formatted: string}}
 */
function validateWebsite(url) {
  if (!url) return { valid: false, formatted: '' };
  
  let cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  
  try {
    const parsedUrl = new URL(cleaned);
    return { valid: true, formatted: parsedUrl.href };
  } catch (err) {
    return { valid: false, formatted: url };
  }
}

/**
 * Validates and formats a Telegram handle
 * @param {string} handle
 * @returns {{valid: boolean, formatted: string}}
 */
function validateTelegram(handle) {
  if (!handle) return { valid: false, formatted: '' };
  
  let cleaned = handle.trim();
  if (cleaned.startsWith('t.me/')) {
    cleaned = '@' + cleaned.substring(5);
  } else if (cleaned.startsWith('https://t.me/')) {
    cleaned = '@' + cleaned.substring(13);
  } else if (!cleaned.startsWith('@')) {
    cleaned = '@' + cleaned;
  }
  
  // Validate telegram handle format (5-32 chars, a-z, 0-9, underscores)
  const handleRegex = /^@[a-zA-Z0-9_]{5,32}$/;
  
  if (handleRegex.test(cleaned)) {
    return { valid: true, formatted: cleaned };
  }
  return { valid: false, formatted: handle };
}

module.exports = {
  validatePhone,
  validateEmail,
  validateWebsite,
  validateTelegram
};
