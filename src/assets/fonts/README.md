# Proxima Nova Font Installation

## Required Font Files

To complete the SessionBoard design system implementation, you need to add the following Proxima Nova font files to this directory:

### WOFF2 Files (Primary - Better Compression)
- `ProximaNova-Light.woff2` (Font weight: 400)
- `ProximaNova-Regular.woff2` (Font weight: 500)
- `ProximaNova-Semibold.woff2` (Font weight: 600)
- `ProximaNova-Bold.woff2` (Font weight: 700)

### WOFF Files (Fallback - Broader Browser Support)
- `ProximaNova-Light.woff`
- `ProximaNova-Regular.woff`
- `ProximaNova-Semibold.woff`
- `ProximaNova-Bold.woff`

## Font Weight Mapping

The design system uses these font weights:
- **Light (400)**: Body text, paragraphs, help text
- **Regular (500)**: Medium emphasis text, navigation, form labels
- **Semibold (600)**: Headings (h2-h6), buttons, emphasized text
- **Bold (700)**: Main headings (h1), high emphasis elements

## How to Obtain Proxima Nova

Proxima Nova is a commercial font that requires a license. You can obtain it from:

1. **Adobe Fonts** (if you have Creative Cloud)
   - Search for "Proxima Nova" in Adobe Fonts
   - Download the font files
   - Convert to web formats if needed

2. **Mark Simonson Studio** (Original Designer)
   - Website: https://www.marksimonson.com/fonts/view/proxima-nova
   - Purchase a web font license

3. **Font Squirrel** (Web Font Generator)
   - If you have desktop fonts, use their webfont generator
   - Website: https://www.fontsquirrel.com/tools/webfont-generator

4. **Other Font Vendors**
   - MyFonts, Fonts.com, etc.
   - Ensure you get a web font license

## Converting Font Files

If you have desktop font files (.otf, .ttf), you can convert them to web formats:

1. Use Font Squirrel's Webfont Generator
2. Upload your licensed font files
3. Select "Optimal" settings
4. Download and extract the WOFF/WOFF2 files

## Installation

1. Place all 8 font files in this directory (`src/assets/fonts/`)
2. The fonts are already configured in `src/styles/typography.css`
3. Rebuild your project: `npm run build:dev`
4. The app will automatically use Proxima Nova with Inter as fallback

## File Structure

After adding fonts, your directory should look like:

```
src/assets/fonts/
├── README.md (this file)
├── ProximaNova-Light.woff2
├── ProximaNova-Light.woff
├── ProximaNova-Regular.woff2
├── ProximaNova-Regular.woff
├── ProximaNova-Semibold.woff2
├── ProximaNova-Semibold.woff
├── ProximaNova-Bold.woff2
└── ProximaNova-Bold.woff
```

## Testing

After adding the fonts:

1. Open Developer Tools in your browser
2. Go to Network tab
3. Reload the page
4. Look for font file requests
5. Check that Proxima Nova loads successfully

## Fallback Behavior

If Proxima Nova files are not available:
- The app will fallback to Inter (loaded from Google Fonts)
- Then to system fonts (SF Pro, Segoe UI, etc.)
- Design and functionality remain intact

## License Compliance

⚠️ **Important**: Ensure you have proper licensing for web use of Proxima Nova. Desktop font licenses typically do not cover web usage. 