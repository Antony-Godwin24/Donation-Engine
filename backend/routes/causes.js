const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');

// Get all causes with beneficiary info
router.get('/', async (req, res) => {
  try {
    const causes = await Cause.find().populate('beneficiaryId').sort({ createdAt: -1 });
    res.json(causes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new cause
router.post('/', async (req, res) => {
  try {
    const cause = new Cause(req.body);
    const savedCause = await cause.save();
    const populatedCause = await Cause.findById(savedCause._id).populate('beneficiaryId');
    res.status(201).json(populatedCause);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get cause by ID
router.get('/:id', async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id).populate('beneficiaryId');
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    res.json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cause
router.put('/:id', async (req, res) => {
  try {
    const cause = await Cause.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('beneficiaryId');
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    res.json(cause);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete cause
router.delete('/:id', async (req, res) => {
  try {
    const cause = await Cause.findByIdAndDelete(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    res.json({ message: 'Cause deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;