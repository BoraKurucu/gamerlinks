/**
 * Script to generate PNG logos from SVG
 * Run with: node generate-logos.js
 * 
 * Note: This requires sharp or puppeteer to be installed.
 * If not available, you can use an online SVG to PNG converter
 * or manually export the SVG files as PNG using any image editor.
 */

const fs = require('fs');
const path = require('path');

console.log('Generating PNG logos from SVG...');
console.log('');
console.log('To generate PNG files, you have a few options:');
console.log('');
console.log('Option 1: Use an online converter');
console.log('  - Visit https://cloudconvert.com/svg-to-png or similar');
console.log('  - Upload public/logo.svg');
console.log('  - Export at 192x192 and 512x512 sizes');
console.log('  - Save as logo192.png and logo512.png in public/ folder');
console.log('');
console.log('Option 2: Install sharp and run this script');
console.log('  npm install sharp');
console.log('  node generate-logos.js');
console.log('');
console.log('Option 3: Use ImageMagick or GraphicsMagick');
console.log('  brew install imagemagick  # macOS');
console.log('  convert -background none -resize 192x192 public/logo.svg public/logo192.png');
console.log('  convert -background none -resize 512x512 public/logo.svg public/logo512.png');
console.log('');
console.log('The SVG logo files have been created at:');
console.log('  - public/logo.svg (512x512)');
console.log('  - public/favicon.svg (32x32)');
console.log('');
console.log('For now, the site will use SVG favicon (supported by modern browsers).');
console.log('PNG files are optional for older browser compatibility and PWA manifests.');

// Try to use sharp if available
try {
  const sharp = require('sharp');
  
  const svgPath = path.join(__dirname, 'public', 'logo.svg');
  const output192 = path.join(__dirname, 'public', 'logo192.png');
  const output512 = path.join(__dirname, 'public', 'logo512.png');
  
  if (fs.existsSync(svgPath)) {
    console.log('Sharp found! Generating PNG files...');
    
    sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(output192)
      .then(() => {
        console.log('✓ Generated logo192.png');
        return sharp(svgPath)
          .resize(512, 512)
          .png()
          .toFile(output512);
      })
      .then(() => {
        console.log('✓ Generated logo512.png');
        console.log('');
        console.log('All logo files generated successfully!');
      })
      .catch((err) => {
        console.error('Error generating PNG files:', err.message);
        console.log('');
        console.log('Please use one of the alternative methods listed above.');
      });
  } else {
    console.error('SVG file not found at:', svgPath);
  }
} catch (e) {
  // sharp not installed, that's okay - instructions were already printed
}

