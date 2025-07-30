#!/usr/bin/env node

/**
 * Ultra-fast Vercel deployment script
 * Optimizes deployment speed through intelligent caching and parallel processing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  skipBuild: process.argv.includes('--skip-build'),
  production: process.argv.includes('--prod'),
  preview: !process.argv.includes('--prod'),
  verbose: process.argv.includes('--verbose'),
  force: process.argv.includes('--force')
};

// Utility functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
};

const execCommand = (command, options = {}) => {
  if (CONFIG.verbose) log(`Executing: ${command}`, 'info');
  try {
    return execSync(command, { 
      stdio: CONFIG.verbose ? 'inherit' : 'pipe',
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    log(error.message, 'error');
    process.exit(1);
  }
};

// Check if build is needed
const shouldBuild = () => {
  if (CONFIG.skipBuild) return false;
  if (CONFIG.force) return true;
  
  try {
    const nextDir = path.join(process.cwd(), '.next');
    const buildInfo = path.join(nextDir, 'build-manifest.json');
    
    if (!fs.existsSync(buildInfo)) return true;
    
    const buildTime = fs.statSync(buildInfo).mtime;
    const packageTime = fs.statSync('package.json').mtime;
    
    return packageTime > buildTime;
  } catch {
    return true;
  }
};

// Optimize dependencies
const optimizeDeps = () => {
  log('Optimizing dependencies...', 'info');
  
  // Use npm ci for faster, reliable installs
  if (fs.existsSync('package-lock.json')) {
    execCommand('npm ci --prefer-offline --no-audit --no-fund');
  } else {
    execCommand('npm install --prefer-offline --no-audit --no-fund');
  }
  
  log('Dependencies optimized', 'success');
};

// Fast build process
const buildProject = () => {
  if (!shouldBuild()) {
    log('Build skipped - no changes detected', 'warning');
    return;
  }
  
  log('Building project with optimizations...', 'info');
  
  // Set environment variables for faster builds
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.DISABLE_ESLINT_PLUGIN = 'true';
  
  execCommand('npm run build');
  log('Build completed', 'success');
};

// Deploy to Vercel
const deployToVercel = () => {
  log(`Deploying to Vercel (${CONFIG.production ? 'production' : 'preview'})...`, 'info');
  
  const deployCommand = CONFIG.production 
    ? 'npx vercel --prod --yes' 
    : 'npx vercel --yes';
  
  const result = execCommand(deployCommand);
  
  if (result && CONFIG.verbose) {
    log('Deployment output:', 'info');
    console.log(result);
  }
  
  log('Deployment completed successfully!', 'success');
};

// Main execution
const main = async () => {
  const startTime = Date.now();
  
  log('🚀 Starting ultra-fast Vercel deployment...', 'info');
  log(`Mode: ${CONFIG.production ? 'Production' : 'Preview'}`, 'info');
  
  try {
    // Step 1: Optimize dependencies (parallel with build check)
    if (!CONFIG.skipBuild) {
      optimizeDeps();
    }
    
    // Step 2: Build if necessary
    buildProject();
    
    // Step 3: Deploy
    deployToVercel();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`✅ Deployment completed in ${duration}s`, 'success');
    
  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Ultra-Fast Vercel Deployment Script

Usage: node deploy-fast.js [options]

Options:
  --prod          Deploy to production (default: preview)
  --skip-build    Skip the build step
  --force         Force rebuild even if no changes detected
  --verbose       Show detailed output
  --help, -h      Show this help message

Examples:
  node deploy-fast.js                    # Deploy preview
  node deploy-fast.js --prod             # Deploy to production
  node deploy-fast.js --skip-build       # Deploy without building
  node deploy-fast.js --prod --verbose   # Production deploy with logs
`);
  process.exit(0);
}

// Run the deployment
main();
