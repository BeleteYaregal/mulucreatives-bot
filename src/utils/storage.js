const fs = require('fs');
const path = require('path');

const STORAGE_ROOT = path.join(__dirname, '..', '..', 'storage');

const DIRECTORIES = [
  'users',
  'logos',
  'previews',
  'generated',
  'pdf',
  'temp'
];

/**
 * Ensures all storage directories exist
 */
function initStorage() {
  if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true });
  }

  DIRECTORIES.forEach(dir => {
    const dirPath = path.join(STORAGE_ROOT, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

/**
 * Returns full path for a file in storage
 * @param {string} subfolder - The subfolder within storage (e.g., 'logos')
 * @param {string} filename - The name of the file
 * @returns {string} The full absolute path
 */
function getStoragePath(subfolder, filename) {
  return path.join(STORAGE_ROOT, subfolder, filename);
}

/**
 * Saves a buffer to storage/subfolder/filename
 * @param {string} subfolder - The subfolder within storage
 * @param {string} filename - The name of the file
 * @param {Buffer} buffer - The file buffer to save
 * @returns {string} The full absolute path where the file was saved
 */
function saveFile(subfolder, filename, buffer) {
  const filePath = getStoragePath(subfolder, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

module.exports = {
  initStorage,
  getStoragePath,
  saveFile
};
