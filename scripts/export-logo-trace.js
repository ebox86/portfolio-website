const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.resolve(__dirname, '../public/images/logo-trace.svg');
const pngPath = path.resolve(__dirname, '../public/images/logo-trace.png');

async function main() {
  const svgBuffer = await fs.promises.readFile(svgPath);
  const scale = 4;
  const width = 220 * scale;
  const height = 90 * scale;

  await sharp(svgBuffer, { density: 300 })
    .resize(width, height, { fit: 'contain' })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFile(pngPath);

  console.log(`Wrote transparent PNG to ${pngPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
