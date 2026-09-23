const fs = require('fs');
const path = require('path');
const config = require('../config/env');

let cloudinary;
if (config.USE_CLOUDINARY) {
  try {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
    });
  } catch (err) {
    console.warn('[Storage] Cloudinary initialization warning:', err.message);
  }
}

/**
 * Saves file to Cloudinary if enabled, or returns public URL for local disk uploads.
 * @param {Object} file Multer file object
 * @param {string} folder Target folder name
 * @returns {Promise<string>} File URL
 */
const uploadFile = async (file, folder = 'uploads') => {
  if (!file) return null;

  if (config.USE_CLOUDINARY && cloudinary) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `codienych/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }
        ],
        timeout: 25000,
      });
      // Clean up local temp file immediately to conserve disk space
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (error) {
      console.error('[Cloudinary Upload Error]', error);
      // Fallback to local URL if Cloudinary fails
      return `/uploads/${path.basename(file.path)}`;
    }
  }

  // Local storage fallback URL
  const filename = path.basename(file.path);
  return `/uploads/${filename}`;
};

module.exports = { uploadFile };
