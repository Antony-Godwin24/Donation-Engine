const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let storage = {
  donations: [
    {
      _id: '1',
      donorName: 'John Doe',
      email: 'john@example.com',
      amount: 100,
      causeId: '1',
      beneficiaryId: '1',
      donationDate: new Date(),
      message: 'Happy to help!'
    }
  ],
  beneficiaries: [
    {
      _id: '1',
      name: 'Community Food Bank',
      description: 'Providing meals for families in need',
      contactEmail: 'foodbank@community.org',
      phone: '+1-555-0123',
      address: {
        street: '123 Main St',
        city: 'Your City',
        state: 'State',
        zipCode: '12345'
      },
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Animal Shelter',
      description: 'Caring for homeless animals',
      contactEmail: 'shelter@animals.org',
      phone: '+1-555-0124',
      address: {
        street: '456 Oak Ave',
        city: 'Your City',
        state: 'State',
        zipCode: '12345'
      },
      createdAt: new Date()
    }
  ],
  causes: [
    {
      _id: '1',
      title: 'Emergency Food Drive',
      description: 'Help us provide meals for 1000 families this month',
      targetAmount: 5000,
      currentAmount: 1250,
      beneficiaryId: '1',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'Animal Medical Fund',
      description: 'Medical care for rescued animals',
      targetAmount: 3000,
      currentAmount: 800,
      beneficiaryId: '2',
      isActive: true,
      createdAt: new Date()
    }
  ]
};

// API Routes
app.get('/api/donations', (req, res) => {
  const donationsWithDetails = storage.donations.map(donation => ({
    ...donation,
    causeId: storage.causes.find(c => c._id === donation.causeId) || {},
    beneficiaryId: storage.beneficiaries.find(b => b._id === donation.beneficiaryId) || {}
  }));
  res.json(donationsWithDetails);
});

app.post('/api/donations', (req, res) => {
  const newDonation = {
    _id: Date.now().toString(),
    ...req.body,
    donationDate: new Date()
  };
  storage.donations.unshift(newDonation);
  
  // Update cause amount
  const cause = storage.causes.find(c => c._id === req.body.causeId);
  if (cause) {
    cause.currentAmount += req.body.amount;
  }
  
  res.status(201).json({
    ...newDonation,
    causeId: storage.causes.find(c => c._id === req.body.causeId) || {},
    beneficiaryId: storage.beneficiaries.find(b => b._id === req.body.beneficiaryId) || {}
  });
});

app.get('/api/beneficiaries', (req, res) => {
  res.json(storage.beneficiaries);
});

app.post('/api/beneficiaries', (req, res) => {
  const newBeneficiary = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  storage.beneficiaries.push(newBeneficiary);
  res.status(201).json(newBeneficiary);
});

app.get('/api/causes', (req, res) => {
  const causesWithBeneficiaries = storage.causes.map(cause => ({
    ...cause,
    beneficiaryId: storage.beneficiaries.find(b => b._id === cause.beneficiaryId) || {}
  }));
  res.json(causesWithBeneficiaries);
});

app.post('/api/causes', (req, res) => {
  const newCause = {
    _id: Date.now().toString(),
    ...req.body,
    currentAmount: 0,
    isActive: true,
    createdAt: new Date()
  };
  storage.causes.push(newCause);
  res.status(201).json({
    ...newCause,
    beneficiaryId: storage.beneficiaries.find(b => b._id === req.body.beneficiaryId) || {}
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Community Donation Tracker API',
    note: 'Running in temporary mode (MongoDB not installed)',
    status: 'Add some data using the forms!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📝 Running in TEMPORARY MODE - Data will reset on server restart');
  console.log('💾 Install MongoDB for permanent data storage');
});