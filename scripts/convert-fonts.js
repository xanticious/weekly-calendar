const fs = require('fs');
const path = require('path');

// Function to convert TTF file to base64
function convertTtfToBase64(filePath) {
  try {
    const fontBuffer = fs.readFileSync(filePath);
    const base64String = fontBuffer.toString('base64');
    return base64String;
  } catch (error) {
    console.error(`Error reading font file ${filePath}:`, error);
    return null;
  }
}

// Main function to process fonts
function processFonts() {
  const fontsDir = path.join(__dirname, '..', 'fonts');

  // Process Chewy font
  const chewyPath = path.join(fontsDir, 'Chewy', 'Chewy-Regular.ttf');
  const chewyBase64 = convertTtfToBase64(chewyPath);

  // Process Noto Emoji font
  const notoEmojiPath = path.join(
    fontsDir,
    'Noto_Emoji',
    'NotoEmoji-VariableFont_wght.ttf'
  );
  const notoEmojiBase64 = convertTtfToBase64(notoEmojiPath);

  if (!chewyBase64 || !notoEmojiBase64) {
    console.error('Failed to convert one or more fonts');
    return;
  }

  // Generate the font-data.ts content
  const fontDataContent = `// Font data for PDF generation
// Auto-generated from TTF files

export const CHEWY_FONT_BASE64 = '${chewyBase64}';

export const NOTO_EMOJI_FONT_BASE64 = '${notoEmojiBase64}';

// Font configuration
export const FONT_CONFIG = {
  primary: {
    name: 'Chewy',
    fallback: 'helvetica',
    style: 'normal',
  },
  emoji: {
    name: 'NotoEmoji',
    fallback: 'helvetica',
    style: 'normal',
  },
};

// Helper function to check if fonts are available
export const hasFontsLoaded = (): boolean => {
  return CHEWY_FONT_BASE64.length > 0 && NOTO_EMOJI_FONT_BASE64.length > 0;
};
`;

  // Write the updated font-data.ts file
  const fontDataPath = path.join(__dirname, '..', 'lib', 'font-data.ts');
  fs.writeFileSync(fontDataPath, fontDataContent);

  console.log('✅ Font conversion completed!');
  console.log(
    `📊 Chewy font size: ${Math.round(chewyBase64.length / 1024)} KB`
  );
  console.log(
    `📊 Noto Emoji font size: ${Math.round(notoEmojiBase64.length / 1024)} KB`
  );
  console.log(`📄 Updated: ${fontDataPath}`);
}

// Run the script
processFonts();
