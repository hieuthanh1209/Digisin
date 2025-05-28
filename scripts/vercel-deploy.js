#!/usr/bin/env node

/**
 * Simple Vercel deployment script for Restaurant Management System
 * This script deploys the project as a static site without build requirements
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploying Restaurant Management System to Vercel...');

try {
  // Check if we have the essential files
  const requiredFiles = ['index.html', 'vercel.json'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    process.exit(1);
  }

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.log('📥 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Deploy to Vercel
  console.log('📦 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
  console.log(`
🎉 Your Restaurant Management System is now live!

🔗 Access URLs:
   - Landing page: /
   - Manager Dashboard: /dashboard/manager-dashboard.html
   - Documentation: /README.md

💡 Next steps:
   1. Test all dashboards on the live site
   2. Configure custom domain if needed
   3. Setup monitoring and analytics

🚀 Happy managing!
  `);

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('💡 Try running: vercel --prod');
  process.exit(1);
} 