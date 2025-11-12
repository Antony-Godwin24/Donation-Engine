const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Cause = require('../models/Cause');

// Get all donations with populated cause and beneficiary info
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('causeId')
      .populate('beneficiaryId')
      .sort({ donationDate: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    const savedDonation = await donation.save();
    
    // Update cause current amount
    await Cause.findByIdAndUpdate(
      req.body.causeId,
      { $inc: { currentAmount: req.body.amount } }
    );
    
    const populatedDonation = await Donation.findById(savedDonation._id)
      .populate('causeId')
      .populate('beneficiaryId');
    
    res.status(201).json(populatedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('causeId')
      .populate('beneficiaryId');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;