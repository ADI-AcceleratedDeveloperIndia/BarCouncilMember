const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Read .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found!');
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[match[1].trim()] = value;
    }
  });
  
  return env;
}

const env = loadEnv();
const SHEET_ID = '1YwwJVPK3neZVQhNPqjzBR5taukLYFgUkWi_vA4IB9KA';
const SHEETS_TO_CLEAR = ['Quick Support', 'Strong Support', 'Followers'];

async function clearSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    for (const sheetName of SHEETS_TO_CLEAR) {
      try {
        // Get the sheet to find the range
        const sheetInfo = await sheets.spreadsheets.get({
          spreadsheetId: SHEET_ID,
        });

        const sheet = sheetInfo.data.sheets.find(s => s.properties.title === sheetName);
        
        if (!sheet) {
          console.log(`⚠️  Sheet "${sheetName}" not found, skipping...`);
          continue;
        }

        const sheetId = sheet.properties.sheetId;
        const lastRow = sheet.properties.gridProperties?.rowCount || 1000;

        // Clear all data except row 1 (header)
        await sheets.spreadsheets.values.clear({
          spreadsheetId: SHEET_ID,
          range: `${sheetName}!A2:Z${lastRow}`,
        });

        console.log(`✅ Cleared data from "${sheetName}" (kept header row)`);
      } catch (error) {
        console.error(`❌ Error clearing "${sheetName}":`, error.message);
      }
    }

    console.log('\n✨ All sheets cleared successfully!');
    console.log('You can now test the support form and new data will be written correctly.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearSheets();

