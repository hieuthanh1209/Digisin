#!/usr/bin/env node

/**
 * Deployment script for Restaurant Management System
 * Supports multiple deployment targets
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get deployment target from command line arguments
const target = process.argv[2] || 'vercel';

console.log(`🚀 Deploying Restaurant Management System to ${target}...`);

try {
  // Run build first
  console.log('🏗️  Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  switch (target.toLowerCase()) {
    case 'vercel':
      deployToVercel();
      break;
    
    case 'netlify':
      deployToNetlify();
      break;
    
    case 'github':
      deployToGitHubPages();
      break;
    
    case 'firebase':
      deployToFirebase();
      break;
    
    default:
      console.log('❌ Unknown deployment target:', target);
      console.log('💡 Available targets: vercel, netlify, github, firebase');
      process.exit(1);
  }

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

function deployToVercel() {
  console.log('📦 Deploying to Vercel...');
  
  // Check if vercel is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Deploy
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Deployed to Vercel successfully!');
}

function deployToNetlify() {
  console.log('📦 Deploying to Netlify...');
  
  // Check if netlify-cli is installed
  try {
    execSync('netlify --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 Installing Netlify CLI...');
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
  }

  // Deploy
  execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
  console.log('✅ Deployed to Netlify successfully!');
}

function deployToGitHubPages() {
  console.log('📦 Deploying to GitHub Pages...');
  
  // Check if gh-pages is installed
  try {
    execSync('gh-pages --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 Installing gh-pages...');
    execSync('npm install -g gh-pages', { stdio: 'inherit' });
  }

  // Deploy
  execSync('gh-pages -d dist', { stdio: 'inherit' });
  console.log('✅ Deployed to GitHub Pages successfully!');
}

function deployToFirebase() {
  console.log('📦 Deploying to Firebase Hosting...');
  
  // Check if firebase-tools is installed
  try {
    execSync('firebase --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 Installing Firebase CLI...');
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
  }

  // Create firebase.json if it doesn't exist
  const firebaseConfig = {
    "hosting": {
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  };

  if (!fs.existsSync('firebase.json')) {
    fs.writeFileSync('firebase.json', JSON.stringify(firebaseConfig, null, 2));
    console.log('📄 Created firebase.json');
  }

  // Deploy
  console.log('🔐 Please login to Firebase if prompted...');
  execSync('firebase login --no-localhost', { stdio: 'inherit' });
  execSync('firebase deploy', { stdio: 'inherit' });
  console.log('✅ Deployed to Firebase successfully!');
}

// Deployment success message
console.log(`
🎉 Deployment completed!

📱 Your Restaurant Management System is now live!

🔗 Access URLs:
   - Landing page: /
   - Manager Dashboard: /dashboard/manager-dashboard.html
   - Documentation: /README.md

💡 Next steps:
   1. Test all dashboards on the live site
   2. Configure custom domain if needed
   3. Setup monitoring and analytics
   4. Plan Firebase integration

🚀 Happy managing!
`); 