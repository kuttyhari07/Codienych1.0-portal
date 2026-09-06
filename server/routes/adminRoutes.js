const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const {
  loginAdmin,
  logoutAdmin,
  getDashboardStats,
  getRegistrations,
  getRegistrationById,
  approveTeamRegistration,
  rejectTeamRegistration,
  getPayments,
  verifyPayment,
  rejectPayment,
  getParticipants,
  verifyParticipant,
  rejectParticipant,
  exportReport,
} = require('../controllers/adminController');

// Public admin routes
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Protected admin routes
router.use(protectAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/export-report', exportReport);

router.get('/registrations', getRegistrations);
router.get('/registrations/:id', getRegistrationById);
router.patch('/registrations/:id/approve-team', approveTeamRegistration);
router.patch('/registrations/:id/reject-team', rejectTeamRegistration);

router.get('/payments', getPayments);
router.patch('/payments/:id/verify', verifyPayment);
router.patch('/payments/:id/reject', rejectPayment);

router.get('/participants', getParticipants);
router.patch('/participants/:id/verify', verifyParticipant);
router.patch('/participants/:id/reject', rejectParticipant);

module.exports = router;
