const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define the paths
const backendEnvSource = '.env.backend';
const frontendEnvSource = '.env.client';
const backendTargetDir = 'my-app-api/.env';
const frontendTargetDir = 'my-app/.env';

// Check if the directories exist before copying
if (!fs.existsSync('my-app-api')) {
  console.error("Error: 'my-app-api' directory not found. Ensure the repository is cloned.");
  process.exit(1);
}

if (!fs.existsSync('my-app')) {
  console.error("Error: 'my-app' directory not found. Ensure the repository is cloned.");
  process.exit(1);
}

// Copy environment files to the cloned directories
fs.copyFileSync(backendEnvSource, backendTargetDir);
fs.copyFileSync(frontendEnvSource, frontendTargetDir);

// Generate a random 32-byte secret and convert it to a hexadecimal string
const jwtSecret = crypto.randomBytes(32).toString('hex');
const variableName = 'JWT_SECRET';

// Read the content of the .env file
let envFileContent = '';
if (fs.existsSync(backendTargetDir)) {
  envFileContent = fs.readFileSync(backendTargetDir, 'utf-8');
}

// Create a regular expression to match the existing variable
const regex = new RegExp(`^${variableName}=.*$`, 'm');

// Check if the variable already exists
if (regex.test(envFileContent)) {
  // If it exists, replace it
  envFileContent = envFileContent.replace(regex, `${variableName}=${jwtSecret}`);
} else {
  // If it does not exist, add it
  envFileContent += `\n${variableName}=${jwtSecret}\n`;
}

// Write the updated content back to the file
fs.writeFileSync(backendTargetDir, envFileContent, 'utf-8');

console.log("Environment files successfully copied and JWT secret added.");
