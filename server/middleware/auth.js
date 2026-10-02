const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/env');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Admin login required.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or deactivated.',
      });
    }

    // Invalidate tokens that don't match the current tokenVersion (logs out all older sessions)
    const currentTokenVersion = req.admin.tokenVersion || 0;
    if (decoded.tokenVersion === undefined || decoded.tokenVersion !== currentTokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Session has expired or was revoked. Please log in again with your credentials.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired. Please login again.',
    });
  }
};

module.exports = { protectAdmin };
