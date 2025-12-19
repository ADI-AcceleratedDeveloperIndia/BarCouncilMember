# White-Label Product Verification

## ✅ Layout Variants Confirmed

The website has **THREE layout variants** fully implemented:

1. **Center Layout** (`layoutVariant: "center"`)
   - Photo centered at top
   - Name and content centered below
   - Classic, formal appearance

2. **Left Layout** (`layoutVariant: "left"`)
   - Photo on the left side
   - Content on the right side
   - Side-by-side layout

3. **Right Layout** (`layoutVariant: "right"`)
   - Photo on the right side
   - Content on the left side
   - Reversed side-by-side layout

**How to Test:**
1. Edit `/config/candidate.config.ts`
2. Change `layoutVariant: "center"` to `"left"` or `"right"`
3. Save and refresh browser
4. All sections (Hero, About, Experience, Vision) will update automatically

## ✅ White-Label Readiness Checklist

### Configuration-Based (✅ Complete)
- [x] Candidate name - in config
- [x] Candidate photo path - in config
- [x] Layout variant - in config
- [x] Default language - in config
- [x] Google Sheet ID - in config
- [x] WhatsApp share text - in config

### No Hardcoded Values (✅ Verified)
- [x] No candidate names hardcoded
- [x] No photo paths hardcoded
- [x] No layout preferences hardcoded
- [x] All content comes from config or content files

### Reusable Components (✅ Complete)
- [x] All components accept props
- [x] Layout variant passed to all sections
- [x] Language toggle works independently
- [x] Support flow is generic

## 🧪 Testing Recommendations

### Before Using as Standard Template:

#### Option 1: Test with Google Sheets First (Recommended)
**Pros:**
- Verify end-to-end functionality
- Test data logging works
- Ensure image generation works
- Validate support flow

**Steps:**
1. Set up Google Sheets (see SETUP_GUIDE.md)
2. Add test candidate photo
3. Test Quick Support flow
4. Test Strong Support flow
5. Verify data appears in sheets
6. Test image download
7. Once verified, save as master template

#### Option 2: Use as Template Now (Also Valid)
**Pros:**
- Start using immediately
- Test with real candidates
- Google Sheets can be added later

**Note:** Website will work without Google Sheets, but:
- Support submissions won't be logged
- You'll see API errors in console (non-blocking)
- All other features work normally

## 📋 Quick Test Checklist

### Visual Testing (No Google Sheets Needed)
- [ ] Change `layoutVariant` to "left" - verify layout changes
- [ ] Change `layoutVariant` to "right" - verify layout changes
- [ ] Change `layoutVariant` to "center" - verify layout changes
- [ ] Toggle language (English ↔ Telugu)
- [ ] Test on mobile device
- [ ] Verify all sections display correctly

### Functional Testing (Requires Google Sheets)
- [ ] Quick Support button works
- [ ] Strong Support form works
- [ ] Support card image generates
- [ ] Image downloads (PNG/JPEG)
- [ ] WhatsApp share works
- [ ] Data appears in Google Sheets

## 🎯 Recommendation

**For Production Use:**

1. **Test layout variants first** (5 minutes)
   - Change config and verify all three layouts work
   - This confirms white-label functionality

2. **Test with Google Sheets** (30 minutes)
   - Set up one test sheet
   - Verify end-to-end flow
   - This confirms data logging works

3. **Save as master template**
   - Once verified, this becomes your standard
   - Copy for each new candidate
   - Only change config + photo

**For Quick Start:**

- You can use it immediately for visual/layout testing
- Google Sheets setup can be done later
- Website works without sheets (just no data logging)

## 🔄 Reuse Workflow

For each new advocate:

1. **Copy entire project folder**
2. **Update config only:**
   ```typescript
   // config/candidate.config.ts
   name: "New Advocate Name"
   photo: "/candidate/photo.jpg"  // Same path, different file
   layoutVariant: "left"  // Choose variant
   googleSheetId: "NEW_SHEET_ID"  // New sheet per candidate
   ```
3. **Replace photo:** `/public/candidate/photo.jpg`
4. **Create new Google Sheet** (or reuse with different tabs)
5. **Deploy**

**That's it!** No code changes needed.

## ✅ Current Status

**Everything is set in place for white-label reuse:**
- ✅ Three layout variants implemented
- ✅ All config-based
- ✅ No hardcoded values
- ✅ Ready for multiple candidates
- ✅ Google Sheets optional (works without it)

**You can:**
- Use it as template now (test layouts)
- OR test with Google Sheets first (recommended for production)
- Both approaches are valid!

