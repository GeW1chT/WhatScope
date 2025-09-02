const fs = require('fs');
const path = require('path');

// Read the logo file
const logoPath = path.join('public', 'logo.png');
const buffer = fs.readFileSync(logoPath);

// Check PNG signature
const pngSignature = buffer.subarray(0, 8);
console.log('PNG Signature:', pngSignature);

// Check if it's a valid PNG
const isValidPng = pngSignature[0] === 0x89 && 
                  pngSignature[1] === 0x50 &&  // P
                  pngSignature[2] === 0x4E &&  // N
                  pngSignature[3] === 0x47 &&  // G
                  pngSignature[4] === 0x0D &&  // \r
                  pngSignature[5] === 0x0A &&  // \n
                  pngSignature[6] === 0x1A &&  // EOF
                  pngSignature[7] === 0x0A;    // \n

console.log('Is valid PNG:', isValidPng);

// Check IHDR chunk (contains image info)
const ihdrChunk = buffer.subarray(12, 20);
console.log('IHDR Chunk:', ihdrChunk);

// Check color type (at position 17 in IHDR chunk)
// Color types: 0=Grayscale, 2=RGB, 3=Palette, 4=Grayscale+Alpha, 6=RGB+Alpha
const colorType = buffer[25]; // 25 = 12 (start of IHDR) + 13 (color type position)
console.log('Color Type:', colorType);
console.log('Color Type Info:');
console.log('0: Grayscale');
console.log('2: RGB');
console.log('3: Palette');
console.log('4: Grayscale + Alpha');
console.log('6: RGB + Alpha');

if (colorType === 4 || colorType === 6) {
  console.log('✓ This image supports transparency');
} else {
  console.log('✗ This image does not support transparency');
}