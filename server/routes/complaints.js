const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getUserComplaints,
  getComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create new complaint
router.post('/', auth, upload.single('image'), createComplaint);

// Get all complaints (admin only)
router.get('/', auth, isAdmin, getAllComplaints);

// Get user's complaints
router.get('/user', auth, getUserComplaints);

// Get single complaint
router.get('/:id', auth, getComplaint);

// Update complaint status (admin only)
router.put('/:id/status', auth, isAdmin, updateComplaintStatus);

// Delete complaint
router.delete('/:id', auth, deleteComplaint);

module.exports = router; 