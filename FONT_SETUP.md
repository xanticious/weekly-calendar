# Font Setup for PDF Generation

This calendar application uses Google Fonts in the generated PDFs:

- **Chewy** font for all text
- **Noto Emoji** font for all emojis

## Current Status

Currently, the application uses fallback fonts (Helvetica) because the Google Font files are not embedded. To use the actual Google Fonts, follow the setup instructions below.

## How to Add Google Fonts

To embed the actual Google Fonts in your PDFs, you need to:

### 1. Download the Font Files

1. Go to [Google Fonts](https://fonts.google.com/)
2. Download the **Chewy** font family
3. Download the **Noto Emoji** font family
4. Extract the TTF files from the downloaded zip files

### 2. Convert to Base64

You need to convert the TTF files to base64 strings:

```bash
# On macOS/Linux:
base64 -i Chewy-Regular.ttf > chewy-base64.txt
base64 -i NotoEmoji-Regular.ttf > noto-emoji-base64.txt

# On Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("Chewy-Regular.ttf")) > chewy-base64.txt
[Convert]::ToBase64String([IO.File]::ReadAllBytes("NotoEmoji-Regular.ttf")) > noto-emoji-base64.txt
```

### 3. Update font-data.ts

Replace the empty strings in `lib/font-data.ts` with your base64 font data:

```typescript
// Replace these empty strings with your base64 font data
export const CHEWY_FONT_BASE64 = 'your-chewy-font-base64-string-here';
export const NOTO_EMOJI_FONT_BASE64 = 'your-noto-emoji-font-base64-string-here';
```

### 4. Legal Considerations

Make sure you comply with the font licenses:

- **Chewy**: Available under the Open Font License
- **Noto Emoji**: Available under the SIL Open Font License

Both fonts are free to use and distribute, but check the latest license terms.

## Alternative Approach

If you prefer not to embed fonts directly, you could:

1. Generate the PDF server-side using a service like Puppeteer
2. Use a PDF generation service that supports Google Fonts
3. Pre-render the calendar as HTML with Google Fonts, then convert to PDF

## Testing

Once you've added the font files, the PDF generation will automatically use them. You can verify this by:

1. Generating a calendar
2. Opening the PDF and checking that the text appears in the Chewy font style
3. Confirming that emojis render properly with the Noto Emoji font
