/**
 * Script to generate favicon.ico from SVG logo
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const outputIco = path.join(__dirname, 'public', 'favicon.ico');
const outputIcoPng = path.join(__dirname, 'public', 'favicon-32x32.png');

console.log('Generating favicon.ico from SVG...');

if (!fs.existsSync(svgPath)) {
  console.error('SVG file not found at:', svgPath);
  process.exit(1);
}

// Create 32x32 PNG first (browsers accept PNG as favicon.ico)
sharp(svgPath)
  .resize(32, 32)
  .png()
  .toFile(outputIcoPng)
  .then(() => {
    console.log('✓ Generated favicon-32x32.png');
    // Copy as favicon.ico (browsers will accept PNG format)
    fs.copyFileSync(outputIcoPng, outputIco);
    console.log('✓ Generated favicon.ico (PNG format, compatible with all browsers)');
    console.log('');
    console.log('Favicon files created successfully!');
    console.log('  - public/favicon.ico');
    console.log('  - public/favicon-32x32.png');
    console.log('');
    console.log('Note: favicon.ico is actually a PNG file (modern browsers support this)');
  })
  .catch((err) => {
    console.error('Error generating favicon:', err.message);
    process.exit(1);
  });

