# Google Looker Studio Analytics Setup Guide

This guide explains how to set up premium-looking analytics for the Bar Council Member election website using **FREE** Google Looker Studio.

## Prerequisites

- Google Spreadsheet with three sheets: "Quick Support", "Detailed Support", "Image Downloads"
- Google account with access to Looker Studio

## Step 1: Create Data Source

1. Go to [Google Looker Studio](https://lookerstudio.google.com/)
2. Click **"Create"** → **"Data Source"**
3. Select **"Google Sheets"** connector
4. Choose your election campaign spreadsheet
5. Click **"Connect"**

## Step 2: Configure Data Source

### For "Quick Support" Sheet

- Map columns:
  - Timestamp → Date & Time
  - Support Type → Text
  - Details Provided → Text
  - Image Generated → Text
  - Image Downloaded → Text

### For "Detailed Support" Sheet

- Map columns:
  - Timestamp → Date & Time
  - Support Type → Text
  - Name → Text
  - Enrollment Number → Text
  - District → Text
  - Bar Association → Text
  - Language → Text
  - Image Generated → Text
  - Image Downloaded → Text

### For "Image Downloads" Sheet

- Map columns:
  - Timestamp → Date & Time
  - Support Type → Text
  - Name → Text
  - Enrollment Number → Text
  - Format → Text

## Step 3: Create Dashboard

1. Click **"Create"** → **"Report"**
2. Select your data source
3. Click **"Add to Report"**

## Step 4: Build Metrics Cards

### Total Supports Card

1. Add **"Scorecard"** chart
2. Data:
   - Metric: `COUNT(Support Type)` from both Quick Support and Detailed Support sheets
   - Comparison: Previous period (optional)

### Quick Supports Count

1. Add **"Scorecard"** chart
2. Data:
   - Metric: `COUNT(Support Type)` where Support Type = "Quick Support"

### Detailed Supports Count

1. Add **"Scorecard"** chart
2. Data:
   - Metric: `COUNT(Support Type)` where Support Type = "Detailed Support"

### Total Image Downloads

1. Add **"Scorecard"** chart
2. Data:
   - Metric: `COUNT(Timestamp)` from Image Downloads sheet

## Step 5: Create Charts

### Pie Chart: Quick vs Detailed Support

1. Add **"Pie Chart"**
2. Dimension: `Support Type`
3. Metric: `COUNT(Support Type)`
4. Combine data from both Quick Support and Detailed Support sheets

### Bar Chart: District-wise Support

1. Add **"Bar Chart"**
2. Dimension: `District` (from Detailed Support sheet)
3. Metric: `COUNT(District)`
4. Sort: Descending by count

### Line Chart: Support Activity Over Time

1. Add **"Time Series Chart"**
2. Dimension: `Timestamp` (grouped by Hour or Day)
3. Metric: `COUNT(Timestamp)`
4. Combine data from both support sheets

## Step 6: Conversion Metrics

### % Supporters Who Provided Full Details

1. Add **"Scorecard"** chart
2. Create calculated field:
   ```
   (COUNT(Detailed Support) / (COUNT(Quick Support) + COUNT(Detailed Support))) * 100
   ```
3. Format as percentage

### % Supporters Who Downloaded Images

1. Add **"Scorecard"** chart
2. Create calculated field:
   ```
   (COUNT(Image Downloads) / (COUNT(Quick Support) + COUNT(Detailed Support))) * 100
   ```
3. Format as percentage

## Step 7: Design & Styling

### Theme

- Use **Dark Theme** or **Neutral Theme**
- Colors: Black, White, Gold accents (matching website)

### Layout

- Arrange metrics cards at the top
- Place charts below in grid layout
- Ensure mobile responsiveness

### Typography

- Use clear, readable fonts
- Large numbers for metrics
- Consistent sizing

## Step 8: Share Dashboard

1. Click **"Share"** button
2. Set permissions:
   - **Viewer**: Anyone with link can view (read-only)
   - No authentication required for viewers
3. Copy shareable link
4. Share with candidate

## Dashboard Features

- **Real-time Updates**: Data refreshes automatically (can set refresh interval)
- **Mobile-Friendly**: Responsive design
- **Export Options**: PDF, CSV (for viewers)
- **No Cost**: Completely free for viewers

## Best Practices

1. **Refresh Schedule**: Set automatic refresh (e.g., every hour)
2. **Date Range Filters**: Add date range selector for time-based analysis
3. **Clean Data**: Ensure Google Sheets data is clean and consistent
4. **Regular Monitoring**: Check dashboard regularly during campaign

## Example Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Total Supports    Quick    Detailed   │
│     1,234           456       778      │
├─────────────────────────────────────────┤
│  Image Downloads   Conversion Rate      │
│      890             72%               │
├─────────────────────────────────────────┤
│  [Pie Chart: Quick vs Detailed]         │
├─────────────────────────────────────────┤
│  [Bar Chart: District-wise Support]     │
├─────────────────────────────────────────┤
│  [Line Chart: Support Activity Over Time]│
└─────────────────────────────────────────┘
```

## Troubleshooting

- **Data not updating**: Check Google Sheets connection and refresh schedule
- **Missing data**: Verify Google Sheets API permissions
- **Charts not showing**: Ensure data source is properly connected
- **Mobile view issues**: Test responsive layout in Looker Studio preview

## Support

For issues with Looker Studio setup, refer to:
- [Looker Studio Help Center](https://support.google.com/looker-studio)
- [Looker Studio Community](https://support.google.com/looker-studio/community)

