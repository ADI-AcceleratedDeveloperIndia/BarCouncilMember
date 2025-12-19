# Bar Council Member Election Website

A production-ready, white-label election campaign website product for Telangana State Bar Council candidates.

## Features

- **White-Label Product**: Reusable template for multiple candidates
- **Config-Based Customization**: Change candidate details via config file
- **Three Layout Variants**: Center, Left, Right layouts
- **Bilingual Support**: English and Telugu with instant toggle
- **Dual Support Flow**: Quick Support (one-click) and Strong Support (form)
- **Client-Side Image Generation**: Zero-cost support card generation
- **Google Sheets Integration**: Automatic data logging
- **Social Sharing**: WhatsApp share functionality
- **Premium Design**: Black, White, Gold color scheme

## Quick Start

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed step-by-step instructions.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Candidate Details

Edit `/config/candidate.config.ts`:

```typescript
export const candidateConfig = {
  name: "ADVOCATE NAME",
  designation: "Candidate for Member – Telangana State Bar Council",
  photo: "/candidate/photo.jpg",
  layoutVariant: "center", // "left" | "center" | "right"
  defaultLanguage: "en", // "en" | "te"
  googleSheetId: "YOUR_GOOGLE_SHEET_ID",
  whatsappShareText: {
    en: "I support this candidate...",
    te: "తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్...",
  },
};
```

### 3. Add Candidate Photo

Place candidate photo at `/public/candidate/photo.jpg`

**Important:** The photo file must exist before running the application. Recommended: Square format, at least 800x800 pixels, JPG or PNG format.

**Important:** The photo file must exist before running the application. Recommended: Square format, at least 800x800 pixels, JPG or PNG format.

### 4. Google Sheets Setup

1. Create a Google Spreadsheet
2. Create three sheets (tabs):
   - **Quick Support**: Columns - Timestamp, Support Type, Details Provided, Image Generated, Image Downloaded
   - **Strong Support**: Columns - Timestamp, Support Type, Name, Enrollment Number, District, Bar Association, Mobile Number, Language, Image Generated, Image Downloaded
   - **Followers**: Columns - Timestamp, Support Type, Name, Enrollment Number, District, Bar Association, Mobile Number, Custom Message, Language, Status, Format

3. Create a Google Service Account:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create Service Account
   - Download JSON key file
   - Share your Google Sheet with the service account email

4. Set Environment Variables:

Create `.env.local`:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Reusing for New Candidates

1. Copy the entire project folder
2. Update `/config/candidate.config.ts`
3. Replace `/public/candidate/photo.jpg`
4. Update Google Sheet ID in config
5. Deploy as new project

## Analytics Setup (Google Looker Studio)

1. Open [Google Looker Studio](https://lookerstudio.google.com/)
2. Create new data source
3. Select "Google Sheets" connector
4. Connect to your Google Spreadsheet
5. Create dashboard with:
   - Total Supports metric
   - Quick vs Strong Support pie chart
   - District-wise bar chart
   - Time-series line chart
   - Conversion metrics

## Design Constraints

- **Colors Only**: Black (#000000), White (#FFFFFF), Gold (#D4AF37)
- **No Icons**: Text-based UI only
- **No Animations**: Static, dignified design
- **Mobile-First**: Fully responsive

## Support Flow

1. User clicks "I Will Vote / Support" button
2. Quick Support screen appears with thumbs-up button
3. User clicks thumbs-up → Support logged
4. User chooses "Add Details" or "Skip"
5. If "Add Details" → Form appears
6. Support card image generated
7. User can download PNG/JPEG or share on WhatsApp

## License

Private - For Bar Council Election Use Only

