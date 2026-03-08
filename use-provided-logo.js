/**
 * Script to generate logo files from the provided logo.png
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceLogo = path.join(__dirname, 'src', 'logo.png');
const publicDir = path.join(__dirname, 'public');
const buildDir = path.join(__dirname, 'build');

console.log('Using provided logo.png from src/');
console.log('');

if (!fs.existsSync(sourceLogo)) {
  console.error('Error: src/logo.png not found!');
  process.exit(1);
}

// Generate different sizes
async function generateLogos() {
  try {
    console.log('Generating logo files from src/logo.png...');
    
    // Generate logo512.png (512x512)
    await sharp(sourceLogo)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo512.png'));
    console.log('✓ Generated public/logo512.png');
    
    // Generate logo192.png (192x192)
    await sharp(sourceLogo)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo192.png'));
    console.log('✓ Generated public/logo192.png');
    
    // Generate favicon-32x32.png - make logo fill most of the space (30x30 with 1px padding)
    await sharp(sourceLogo)
      .resize(30, 30, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 1, bottom: 1, left: 1, right: 1, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✓ Generated public/favicon-32x32.png (larger size)');
    
    // Generate favicon.ico - make logo fill most of the space (30x30 with 1px padding)
    await sharp(sourceLogo)
      .resize(30, 30, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 1, bottom: 1, left: 1, right: 1, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✓ Generated public/favicon.ico (larger size)');
    
    // Copy original to public
    fs.copyFileSync(sourceLogo, path.join(publicDir, 'logo.png'));
    console.log('✓ Copied logo.png to public/logo.png');
    
    // Copy to build directory
    fs.copyFileSync(path.join(publicDir, 'logo512.png'), path.join(buildDir, 'logo512.png'));
    fs.copyFileSync(path.join(publicDir, 'logo192.png'), path.join(buildDir, 'logo192.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(buildDir, 'favicon-32x32.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon.ico'), path.join(buildDir, 'favicon.ico'));
    console.log('✓ Copied all files to build/ directory');
    
    console.log('');
    console.log('All logo files generated successfully!');
    
  } catch (err) {
    console.error('Error generating logos:', err.message);
    process.exit(1);
  }
}

generateLogos();

