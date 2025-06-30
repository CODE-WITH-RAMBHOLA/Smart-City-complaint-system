const Complaint = require('../models/Complaint');
const fs = require('fs');
const path = require('path');

// Create new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;
    
    const complaint = new Complaint({
      title,
      description,
      category,
      location,
      priority,
      user: req.user._id,
      image: req.file ? req.file.path : null
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    // If there's an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all complaints (admin only)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's complaints
exports.getUserComplaints = async (req, res) => {
  try {
    console.log('Getting complaints for user:', req.user._id);
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    console.log('Found complaints:', complaints);
    res.json(complaints);
  } catch (error) {
    console.error('Error in getUserComplaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single complaint
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user is admin or the complaint owner
    if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update complaint status (admin only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (adminRemarks) {
      complaint.adminRemarks = adminRemarks;
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user is admin or the complaint owner
    if (req.user.role !== 'admin' && complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await complaint.remove();
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 