require('dotenv').config();
const valkeyClient = require('./valkeyClient');

const IMAGES = [
  'https://res.cloudinary.com/dthkwifzi/image/upload/q_auto/f_auto/v1779621663/download_bvegev.jpg',
  'https://res.cloudinary.com/dthkwifzi/image/upload/q_auto/f_auto/v1779621707/download_fzkjfg.jpg',
  'https://res.cloudinary.com/dthkwifzi/image/upload/q_auto/f_auto/v1779621748/download_aje18b.jpg',
  'https://res.cloudinary.com/dthkwifzi/image/upload/q_auto/f_auto/v1779621993/download_owjekc.jpg',
];

async function assignImages() {
  try {
    await valkeyClient.connect();
    const keys = await valkeyClient.sendCommand(['KEYS', 'product:*']);
    console.log(`Found ${keys.length} products. Assigning images...`);

    for (let i = 0; i < keys.length; i++) {
      const img = IMAGES[i % IMAGES.length]; // cycle through the 4 images
      await valkeyClient.sendCommand(['JSON.SET', keys[i], '$.images', JSON.stringify([img])]);
      console.log(`✓ ${keys[i]} → image ${(i % IMAGES.length) + 1}`);
    }

    console.log(`\nDone! ${keys.length} products updated.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

assignImages();
