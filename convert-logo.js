const { Jimp } = require('jimp');

async function convertLogo() {
  try {
    // Read the logo
    const image = await Jimp.read('public/logo.png');
    
    // Make white background transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      // Get RGBA values
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // Check if pixel is white (or close to white)
      if (red > 240 && green > 240 && blue > 240) {
        // Make it transparent
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0
      }
    });
    
    // Save the new logo
    await image.write('public/logo-transparent.png');
    
    console.log('Logo converted successfully! Created logo-transparent.png');
  } catch (error) {
    console.error('Error converting logo:', error);
  }
}

convertLogo();