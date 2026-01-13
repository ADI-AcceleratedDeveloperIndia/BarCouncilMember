#!/usr/bin/env node

/**
 * Firebase Setup Automation Script
 * 
 * This script automates Firebase project creation and VAPID key generation
 * for web push notifications.
 * 
 * Usage:
 *   node scripts/setup-firebase.js <client-name>
 * 
 * Example:
 *   node scripts/setup-firebase.js client1
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

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf-8', 
      stdio: 'pipe',
      ...options 
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function generateVAPIDKeys() {
  log('\n🔑 Generating VAPID keys for web push...', 'cyan');
  
  const vapidKeys = webpush.generateVAPIDKeys();
  
  return {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  };
}

function createFirebaseProject(projectId, projectName) {
  log(`\n📦 Creating Firebase project: ${projectId}...`, 'cyan');
  
  try {
    // Create project
    exec(`npx firebase-tools projects:create ${projectId} --display-name "${projectName}"`, {
      stdio: 'inherit'
    });
    
    log(`✅ Firebase project created: ${projectId}`, 'green');
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      log(`⚠️  Project ${projectId} already exists. Using existing project.`, 'yellow');
      return true;
    }
    throw error;
  }
}

function enableCloudMessaging(projectId) {
  log(`\n🔔 Enabling Cloud Messaging API for ${projectId}...`, 'cyan');
  
  try {
    // Enable Cloud Messaging API using gcloud or Firebase CLI
    exec(`npx firebase-tools use ${projectId}`, { stdio: 'inherit' });
    
    // Note: Enabling APIs might require gcloud CLI or manual step
    log(`✅ Cloud Messaging will be enabled in Firebase Console`, 'green');
    log(`   Please verify in: https://console.firebase.google.com/project/${projectId}/settings/cloudmessaging`, 'yellow');
    
    return true;
  } catch (error) {
    log(`⚠️  Could not automatically enable API. Please enable manually in Firebase Console.`, 'yellow');
    return false;
  }
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
  };
  
  fs.writeFileSync(keysFile, JSON.stringify(keysData, null, 2), 'utf-8');
  log(`✅ VAPID keys saved: ${keysFile}`, 'green');
  log(`   ⚠️  Keep this file secure! Add private key to .env file.`, 'yellow');
  
  return keysFile;
}

function createEnvExample() {
  log(`\n📄 Creating .env.example...`, 'cyan');
  
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  const envExampleContent = `# Firebase Cloud Messaging (FCM) Configuration
# Get these values from Firebase Console: https://console.firebase.google.com
# Or run: node scripts/setup-firebase.js <client-name>

# VAPID Private Key (from generated keys)
FIREBASE_VAPID_PRIVATE_KEY=your_private_key_here

# Firebase Project ID
FIREBASE_PROJECT_ID=your_project_id_here

# Optional: Firebase API Key (if needed)
# FIREBASE_API_KEY=your_api_key_here
`;
  
  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envExampleContent, 'utf-8');
    log(`✅ Created .env.example`, 'green');
  } else {
    log(`⚠️  .env.example already exists`, 'yellow');
  }
}

function main() {
  const clientName = process.argv[2];
  
  if (!clientName) {
    log('\n❌ Error: Client name is required', 'red');
    log('\nUsage: node scripts/setup-firebase.js <client-name>', 'yellow');
    log('Example: node scripts/setup-firebase.js client1', 'yellow');
    process.exit(1);
  }
  
  // Generate project ID (Firebase format: lowercase, no spaces, max 30 chars)
  const projectId = `barcouncil-${clientName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`.substring(0, 30);
  const projectName = `Bar Council - ${clientName}`;
  
  log('\n🚀 Firebase Setup Automation', 'blue');
  log('='.repeat(50), 'blue');
  log(`\nClient: ${clientName}`, 'cyan');
  log(`Project ID: ${projectId}`, 'cyan');
  log(`Project Name: ${projectName}`, 'cyan');
  
  // Check if Firebase CLI is authenticated
  log('\n🔐 Checking Firebase authentication...', 'cyan');
  try {
    exec('npx firebase-tools login:list', { stdio: 'pipe' });
    log('✅ Firebase CLI is authenticated', 'green');
  } catch (error) {
    log('\n❌ Firebase CLI not authenticated!', 'red');
    log('\nPlease run this command first:', 'yellow');
    log('  npx firebase-tools login', 'cyan');
    log('\nThis will open a browser for Google authentication.', 'yellow');
    process.exit(1);
  }
  
  try {
    // Step 1: Generate VAPID keys
    const vapidKeys = generateVAPIDKeys();
    log(`✅ VAPID keys generated`, 'green');
    
    // Step 2: Create Firebase project
    createFirebaseProject(projectId, projectName);
    
    // Step 3: Enable Cloud Messaging (might need manual step)
    enableCloudMessaging(projectId);
    
    // Step 4: Save VAPID keys
    const keysFile = saveVAPIDKeys(projectId, vapidKeys, clientName);
    
    // Step 5: Update config file
    updateConfigFile(projectId, vapidKeys, clientName);
    
    // Step 6: Create .env.example
    createEnvExample();
    
    // Summary
    log('\n' + '='.repeat(50), 'green');
    log('\n✅ Firebase Setup Complete!', 'green');
    log('\n📋 Next Steps:', 'cyan');
    log('1. Add VAPID keys to Firebase Console:', 'yellow');
    log(`   https://console.firebase.google.com/project/${projectId}/settings/cloudmessaging`, 'cyan');
    log(`   Public Key: ${vapidKeys.publicKey}`, 'cyan');
    log('\n2. Add private key to .env file:', 'yellow');
    log(`   FIREBASE_VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`, 'cyan');
    log(`   FIREBASE_PROJECT_ID=${projectId}`, 'cyan');
    log('\n3. Keys saved to:', 'yellow');
    log(`   ${keysFile}`, 'cyan');
    log('\n4. Deploy to Vercel and add environment variables there too!', 'yellow');
    log('\n' + '='.repeat(50), 'green');
    
  } catch (error) {
    log('\n❌ Error during setup:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

main();
