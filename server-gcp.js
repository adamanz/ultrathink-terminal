const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firestore
const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  // In Cloud Run, credentials are automatically provided
});

const applicationsCollection = firestore.collection('applications');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

app.post('/api/apply', async (req, res) => {
  const { name, email, github, twitter, project, reason, skills, magicWordDetected } = req.body;
  
  const application = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    name,
    email,
    github,
    twitter,
    project,
    reason,
    skills,
    magicWordDetected: magicWordDetected || false,
    status: magicWordDetected ? 'priority_review' : 'pending'
  };

  try {
    // Save to Firestore
    await applicationsCollection.doc(application.id).set(application);
    
    res.json({ 
      success: true, 
      message: 'Application received. Access pending review.',
      applicationId: application.id 
    });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'System error. Try again later.' 
    });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const snapshot = await applicationsCollection.orderBy('timestamp', 'desc').get();
    const applications = [];
    snapshot.forEach(doc => {
      applications.push(doc.data());
    });
    res.json(applications);
  } catch (error) {
    console.error('Error reading applications:', error);
    res.status(500).json({ error: 'Failed to read applications' });
  }
});

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[SYSTEM] Backend server running on port ${PORT}`);
  console.log(`[SYSTEM] Environment: ${process.env.NODE_ENV || 'development'}`);
});