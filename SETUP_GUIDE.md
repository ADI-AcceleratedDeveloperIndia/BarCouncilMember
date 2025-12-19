# Setup Guide - Bar Council Member Election Website

This guide will help you set up the election website for a new candidate.

## Quick Start Checklist

- [ ] Install dependencies
- [ ] Configure candidate details
- [ ] Add candidate photo
- [ ] Set up Google Sheets
- [ ] Configure Google Service Account
- [ ] Set environment variables
- [ ] Test locally
- [ ] Deploy to Vercel

## Step-by-Step Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Candidate Details

Edit `/config/candidate.config.ts`:

```typescript
export const candidateConfig = {
  name: "Your Advocate Name",
  designation: "Candidate for Member – Telangana State Bar Council",
  photo: "/candidate/photo.jpg", // Path to photo in public folder
  layoutVariant: "center", // Choose: "left" | "center" | "right"
  defaultLanguage: "en", // Choose: "en" | "te"
  googleSheetId: "YOUR_GOOGLE_SHEET_ID",
  whatsappShareText: {
    en: "I support this candidate for Telangana State Bar Council elections.\nPlease visit: ",
    te: "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో ఈ అభ్యర్థికి నా మద్దతు ఉంది.\nవివరాలకు ఈ లింక్ చూడండి: ",
  },
};
```

**Important Notes:**
- `name`: Full name of the candidate
- `photo`: Must be placed at `/public/candidate/photo.jpg`
- `layoutVariant`: Choose layout style (center is most common)
- `defaultLanguage`: Set default language for website
- `googleSheetId`: Get this from your Google Sheet URL

### 3. Add Candidate Photo

1. Place candidate photo at: `/public/candidate/photo.jpg`
2. Recommended specifications:
   - Format: JPG or PNG
   - Size: Square (1:1 aspect ratio) works best
   - Dimensions: At least 800x800 pixels
   - File size: Under 2MB

### 4. Set Up Google Sheets

#### Create Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Bar Council Election - [Candidate Name]")
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

#### Create Required Sheets (Tabs)

Create three sheets with these exact names:

**Sheet 1: "Quick Support"**
- Column A: Timestamp
- Column B: Support Type
- Column C: Details Provided
- Column D: Image Generated
- Column E: Image Downloaded

**Sheet 2: "Strong Support"**
- Column A: Timestamp
- Column B: Support Type
- Column C: Name
- Column D: Enrollment Number
- Column E: District
- Column F: Bar Association
- Column G: Mobile Number
- Column H: Language
- Column I: Image Generated
- Column J: Image Downloaded

**Sheet 3: "Followers"**
- Column A: Timestamp
- Column B: Support Type
- Column C: Name
- Column D: Enrollment Number
- Column E: District
- Column F: Bar Association
- Column G: Mobile Number
- Column H: Custom Message
- Column I: Language
- Column J: Status
- Column K: Format

**Tip:** Add headers in row 1 for clarity, but the API will work without them.

### 5. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create Service Account:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name it (e.g., "bar-council-election")
   - Click "Create and Continue"
   - Skip role assignment (click "Continue")
   - Click "Done"

5. Create Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the JSON file

6. Share Google Sheet:
   - Open your Google Sheet
   - Click "Share" button
   - Add the service account email (found in the JSON file as `client_email`)
   - Give it "Editor" access
   - Click "Send"

### 6. Set Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open the downloaded JSON key file from Step 5

3. Extract values:
   - `client_email`: Copy this value
   - `private_key`: Copy the entire private key (including BEGIN and END lines)

4. Update `.env.local`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
   ```

**Important:**
- Keep the quotes around the private key
- Replace `\n` with actual newlines in the private key
- The private key should be on multiple lines

### 7. Update Config with Sheet ID

In `/config/candidate.config.ts`, set:
```typescript
googleSheetId: "YOUR_ACTUAL_SHEET_ID"
```

### 8. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- [ ] Language toggle works
- [ ] Support button appears
- [ ] Quick support flow works
- [ ] Strong support form works
- [ ] Support card image generates
- [ ] Image downloads work
- [ ] WhatsApp share works
- [ ] Data appears in Google Sheets

### 9. Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
5. Deploy

## Troubleshooting

### Photo Not Showing
- Check file path matches config (`/candidate/photo.jpg`)
- Ensure file is in `/public/candidate/` folder
- Check file format (JPG/PNG)

### Google Sheets Not Updating
- Verify service account email has access to sheet
- Check Sheet ID is correct in config
- Verify environment variables are set correctly
- Check sheet names match exactly: "Quick Support", "Strong Support", "Followers"

### Image Generation Fails
- Check browser console for errors
- Ensure candidate photo is accessible
- Try different browser

### Build Errors
- Run `npm install` again
- Check Node.js version (should be 18+)
- Clear `.next` folder and rebuild

## Reusing for New Candidates

To create a website for another candidate:

1. **Copy entire project folder** to a new location
2. **Update config** (`/config/candidate.config.ts`)
3. **Replace photo** (`/public/candidate/photo.jpg`)
4. **Create new Google Sheet** (or reuse with different tabs)
5. **Update Sheet ID** in config
6. **Deploy as new project**

Each candidate gets their own:
- Project folder
- Google Sheet
- Vercel deployment
- Domain (if custom domain is configured)

## Support

For issues or questions, refer to:
- Main README.md
- ANALYTICS_SETUP.md for dashboard setup
- Check browser console for errors
- Verify all environment variables are set

