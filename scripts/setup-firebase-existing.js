#!/usr/bin/env node

/**
 * Firebase Setup Script - Use Existing Project
 * 
 * This script generates VAPID keys and sets up config for an EXISTING Firebase project.
 * Use this when you've hit the project limit and want to use one project for multiple clients.
 * 
 * Usage:
 *   node scripts/setup-firebase-existing.js <client-name> <existing-project-id>
 * 
 * Example:
 *   node scripts/setup-firebase-existing.js client1 barcouncil-elections
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateVAPIDKeys() {
  log('\n🔑 Generating VAPID keys for web push...', 'cyan');
  
  const vapidKeys = webpush.generateVAPIDKeys();
  
  return {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  };
}

function updateConfigFile(projectId, vapidKeys, clientName) {
  log(`\n📝 Updating config file...`, 'cyan');
  
  const configPath = path.join(__dirname, '..', 'config', 'candidate.config.ts');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  
  let configContent = fs.readFileSync(configPath, 'utf-8');
  
  // Check if firebase config already exists
  if (configContent.includes('firebaseConfig')) {
    log(`⚠️  Firebase config already exists in candidate.config.ts`, 'yellow');
    log(`   Please update manually with the following values:`, 'yellow');
    log(`\n   firebaseConfig: {`, 'cyan');
    log(`     projectId: "${projectId}",`, 'cyan');
    log(`     vapidKey: "${vapidKeys.publicKey}",`, 'cyan');
    log(`   },`, 'cyan');
    return;
  }
  
  // Add Firebase config before the closing brace
  const firebaseConfig = `
  // Firebase Cloud Messaging (FCM) Configuration
  firebaseConfig: {
    projectId: "${projectId}",
    vapidKey: "${vapidKeys.publicKey}", // Public VAPID key for web push
    // Private key is stored in environment variables (FIREBASE_VAPID_PRIVATE_KEY)
  },`;
  
  // Insert before the closing brace
  configContent = configContent.replace(
    /(\s+whatsappShareText: \{[\s\S]*?\},[\s]*\};)/,
    `$1${firebaseConfig}`
  );
  
  fs.writeFileSync(configPath, configContent, 'utf-8');
  log(`✅ Config file updated: ${configPath}`, 'green');
}

function saveVAPIDKeys(projectId, vapidKeys, clientName) {
  log(`\n💾 Saving VAPID keys...`, 'cyan');
  
  const keysDir = path.join(__dirname, '..', 'firebase-keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }
  
  const keysFile = path.join(keysDir, `${clientName}-${projectId}.json`);
  
  const keysData = {
    projectId,
    clientName,
    vapidKeys: {
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
    },
    createdAt: new Date().toISOString(),
    note: 'Keep private keys secure! Add FIREBASE_VAPID_PRIVATE_KEY to .env file',
    sharedProject: true,
    instructions: 'This client uses a shared Firebase project. Add the VAPID public key to Firebase Console → Cloud Messaging → Web Push certificates',
  };
  
  fs.writeFileSync(keysFile, JSON.stringify(keysData, null, 2), 'utf-8');
  log(`✅ VAPID keys saved: ${keysFile}`, 'green');
  log(`   ⚠️  Keep this file secure! Add private key to .env file.`, 'yellow');
  
  return keysFile;
}

function main() {
  const clientName = process.argv[2];
  const existingProjectId = process.argv[3];
  
  if (!clientName || !existingProjectId) {
    log('\n❌ Error: Client name and existing project ID are required', 'red');
    log('\nUsage: node scripts/setup-firebase-existing.js <client-name> <existing-project-id>', 'yellow');
    log('Example: node scripts/setup-firebase-existing.js client1 barcouncil-elections', 'yellow');
    process.exit(1);
  }
  
  log('\n🚀 Firebase Setup - Using Existing Project', 'blue');
  log('='.repeat(50), 'blue');
  log(`\nClient: ${clientName}`, 'cyan');
  log(`Using Existing Project ID: ${existingProjectId}`, 'cyan');
  log(`\n⚠️  Note: This uses a SHARED Firebase project.`, 'yellow');
  log(`   Each client will have unique VAPID keys for isolation.`, 'yellow');
  
  try {
    // Step 1: Generate VAPID keys
    const vapidKeys = generateVAPIDKeys();
    log(`✅ VAPID keys generated`, 'green');
    
    // Step 2: Save VAPID keys
    const keysFile = saveVAPIDKeys(existingProjectId, vapidKeys, clientName);
    
    // Step 3: Update config file
    updateConfigFile(existingProjectId, vapidKeys, clientName);
    
    // Summary
    log('\n' + '='.repeat(50), 'green');
    log('\n✅ Setup Complete!', 'green');
    log('\n📋 Next Steps:', 'cyan');
    log('1. Add VAPID Public Key to Firebase Console:', 'yellow');
    log(`   https://console.firebase.google.com/project/${existingProjectId}/settings/cloudmessaging`, 'cyan');
    log(`   - Go to "Web Push certificates"`, 'cyan');
    log(`   - Click "Generate key pair" or "Add key pair"`, 'cyan');
    log(`   - Paste Public Key: ${vapidKeys.publicKey}`, 'cyan');
    log('\n2. Add private key to .env.local file:', 'yellow');
    log(`   FIREBASE_VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`, 'cyan');
    log(`   FIREBASE_PROJECT_ID=${existingProjectId}`, 'cyan');
    log('\n3. Add to Vercel Environment Variables:', 'yellow');
    log(`   FIREBASE_VAPID_PRIVATE_KEY = ${vapidKeys.privateKey}`, 'cyan');
    log(`   FIREBASE_PROJECT_ID = ${existingProjectId}`, 'cyan');
    log('\n4. Keys saved to:', 'yellow');
    log(`   ${keysFile}`, 'cyan');
    log('\n⚠️  IMPORTANT: Each client needs a UNIQUE VAPID key pair!', 'yellow');
    log('   Generate new keys for each client using this script.', 'yellow');
    log('\n' + '='.repeat(50), 'green');
    
  } catch (error) {
    log('\n❌ Error during setup:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

main();
