#!/usr/bin/env node

/**
 * Build script for Restaurant Management System
 * Copies files to dist/ directory for production deployment
 */

const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Function to copy files recursively
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      copyRecursive(srcPath, destPath);
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('🏗️  Building Restaurant Management System...');

try {
  // Copy public directory
  if (fs.existsSync('public')) {
    console.log('📁 Copying public/ directory...');
    copyRecursive('public', path.join(distDir, 'public'));
  }

  // Copy src directory
  if (fs.existsSync('src')) {
    console.log('📁 Copying src/ directory...');
    copyRecursive('src', path.join(distDir, 'src'));
  }

  // Copy config directory
  if (fs.existsSync('config')) {
    console.log('📁 Copying config/ directory...');
    copyRecursive('config', path.join(distDir, 'config'));
  }

  // Copy dashboard directory (legacy support)
  if (fs.existsSync('dashboard')) {
    console.log('📁 Copying dashboard/ directory...');
    copyRecursive('dashboard', path.join(distDir, 'dashboard'));
  }

  // Copy root files if they exist
  const rootFiles = [
    'index.html',
    'script.js', 
    'styles.css'
  ];

  rootFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`📄 Copying ${file}...`);
      fs.copyFileSync(file, path.join(distDir, file));
    }
  });

  // Copy documentation
  const docFiles = [
    'README.md',
    'Summary_Readme.md',
    'Manager_Dashboard_Implementation.md',
    'Project_Structure_Plan.md'
  ];

  docFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`📄 Copying ${file}...`);
      fs.copyFileSync(file, path.join(distDir, file));
    }
  });

  // Create a simple vercel.json for deployment
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "**/*.html",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/",
        "dest": "/public/index.html"
      },
      {
        "src": "/public/(.*)",
        "dest": "/public/$1"
      },
      {
        "src": "/src/(.*)",
        "dest": "/src/$1"
      },
      {
        "src": "/dashboard/(.*)",
        "dest": "/dashboard/$1"
      }
    ]
  };

  fs.writeFileSync(
    path.join(distDir, 'vercel.json'), 
    JSON.stringify(vercelConfig, null, 2)
  );

  console.log('✅ Build completed successfully!');
  console.log(`📦 Build output: ${distDir}`);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 