const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const applicationsFile = path.join(__dirname, 'applications.json');

if (!fs.existsSync(applicationsFile)) {
  fs.writeFileSync(applicationsFile, JSON.stringify([]));
}

app.post('/api/apply', (req, res) => {
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
    const applications = JSON.parse(fs.readFileSync(applicationsFile, 'utf8'));
    applications.push(application);
    fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));
    
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

app.get('/api/applications', (req, res) => {
  try {
    const applications = JSON.parse(fs.readFileSync(applicationsFile, 'utf8'));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read applications' });
  }
});

app.listen(PORT, () => {
  console.log(`[SYSTEM] Backend server running on port ${PORT}`);
});