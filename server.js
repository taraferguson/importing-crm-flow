const express = require('express');
const path = require('path');

// Debug: Print PORT and build output existence
console.log('DEBUG: process.env.PORT =', process.env.PORT);
const fs = require('fs');
const buildPath = path.join(__dirname, 'dist/crm-onboarding');
console.log('DEBUG: Build output exists:', fs.existsSync(buildPath));

// Set memory limits
process.env.NODE_OPTIONS = '--max-old-space-size=512';

const app = express();
const PORT = process.env.PORT || 4200;

// Serve static files from dist/crm-onboarding
app.use(express.static(path.join(__dirname, 'dist/crm-onboarding')));

// Handle Angular routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/crm-onboarding/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 