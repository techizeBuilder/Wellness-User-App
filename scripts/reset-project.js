#!/usr/bin/env node

/**
 * Reset project script for Zenovia Expo app
 * This script helps reset the project to a clean state
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Resetting Zenovia project...\n');

try {
  // Clear Expo cache
  console.log('1️⃣ Clearing Expo cache...');
  execSync('npx expo r --clear', { stdio: 'inherit' });

  // Clear Metro cache
  console.log('2️⃣ Clearing Metro cache...');
  execSync('npx react-native start --reset-cache', { stdio: 'inherit' });

  // Clear node_modules and reinstall
  console.log('3️⃣ Clearing node_modules...');
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }

  console.log('4️⃣ Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Fix Expo dependencies
  console.log('5️⃣ Fixing Expo dependencies...');
  execSync('npx expo install --fix', { stdio: 'inherit' });

  console.log('✅ Project reset complete! You can now run "npm start"');

} catch (error) {
  console.error('❌ Error during reset:', error.message);
  process.exit(1);
}