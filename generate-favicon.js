const sharp = require('sharp');
const fs = require('fs');

async function generateFavicon() {
  try {
    // Generate favicon.ico with multiple sizes
    const pngBuffer = await sharp('public/logo.png')
      .resize(64, 64)
      .png()
      .toBuffer();
      
    // Write the favicon file
    fs.writeFileSync('public/favicon.ico', pngBuffer);
    
    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();