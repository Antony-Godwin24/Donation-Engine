const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/Beneficiary');

// Get all beneficiaries
router.get('/', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 });
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new beneficiary
router.post('/', async (req, res) => {
  try {
    const beneficiary = new Beneficiary(req.body);
    const savedBeneficiary = await beneficiary.save();
    res.status(201).json(savedBeneficiary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get beneficiary by ID
router.get('/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) return res.status(404).json({ message: 'Beneficiary not found' });
    res.json(beneficiary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update beneficiary
router.put('/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!beneficiary) return res.status(404).json({ message: 'Beneficiary not found' });
    res.json(beneficiary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete beneficiary
router.delete('/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);
    if (!beneficiary) return res.status(404).json({ message: 'Beneficiary not found' });
    res.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;