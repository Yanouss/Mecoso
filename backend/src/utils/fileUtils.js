const fs = require('fs');
const path = require('path');

/**
 * Delete a file from the filesystem
 * @param {string} filePath - The file path to delete (can be relative URL or absolute path)
 */
exports.deleteFile = (filePath) => {
  if (!filePath) return;
  
  try {
    let actualPath;
    
    // Handle URLs that start with /uploads/
    if (filePath.startsWith('/uploads/')) {
      actualPath = path.join(__dirname, '..', filePath);
    } 
    // Handle URLs that start with /portfolio/
    else if (filePath.startsWith('/portfolio/')) {
      actualPath = path.join(__dirname, '..', 'public', filePath);
    }
    // Handle absolute paths
    else if (path.isAbsolute(filePath)) {
      actualPath = filePath;
    }
    // Handle relative paths from project root
    else {
      actualPath = path.join(__dirname, '..', filePath);
    }
    
    // Check if file exists and delete it
    if (fs.existsSync(actualPath)) {
      fs.unlinkSync(actualPath);
      console.log(`Deleted file: ${actualPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error.message);
  }
};

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath - Directory path to ensure exists
 */
exports.ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error.message);
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename to get extension from
 * @returns {string} File extension with dot (e.g., '.jpg')
 */
exports.getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Check if file is an image based on extension
 * @param {string} filename - The filename to check
 * @returns {boolean} True if file is an image
 */
exports.isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.includes(exports.getFileExtension(filename));
};

/**
 * Check if file is a video based on extension
 * @param {string} filename - The filename to check
 * @returns {boolean} True if file is a video
 */
exports.isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.includes(exports.getFileExtension(filename));
};

/**
 * Check if file is a document based on extension
 * @param {string} filename - The filename to check
 * @returns {boolean} True if file is a document
 */
exports.isDocumentFile = (filename) => {
  const docExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
  return docExtensions.includes(exports.getFileExtension(filename));
};

/**
 * Generate unique filename with timestamp
 * @param {string} originalName - Original filename
 * @param {string} prefix - Prefix for the filename
 * @returns {string} Unique filename
 */
exports.generateUniqueFilename = (originalName, prefix = 'file') => {
  const extension = exports.getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  return `${prefix}-${timestamp}-${random}${extension}`;
};

/**
 * Clean up old files from array comparison
 * @param {Array} oldArray - Array of old items with file paths
 * @param {Array} newArray - Array of new items
 * @param {string} fileField - Field name containing file path
 */
exports.cleanupOldFiles = (oldArray, newArray, fileField) => {
  if (!oldArray || !Array.isArray(oldArray)) return;
  
  const newFilePaths = new Set();
  if (newArray && Array.isArray(newArray)) {
    newArray.forEach(item => {
      if (item[fileField]) {
        newFilePaths.add(item[fileField]);
      }
    });
  }
  
  oldArray.forEach(oldItem => {
    if (oldItem[fileField] && !newFilePaths.has(oldItem[fileField])) {
      exports.deleteFile(oldItem[fileField]);
    }
  });
};

/**
 * Copy file from source to destination
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 */
exports.copyFile = (sourcePath, destPath) => {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    exports.ensureDirectoryExists(destDir);
    
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied file from ${sourcePath} to ${destPath}`);
  } catch (error) {
    console.error(`Error copying file from ${sourcePath} to ${destPath}:`, error.message);
    throw error;
  }
};