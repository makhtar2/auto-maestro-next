import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const cloudName = 'fe55mqsh';
const apiKey = '316522861513958';
const apiSecret = 'D-nTY8Hge-BzhLGl-M0DYnKioyA';

const vehiclesFile = path.join(process.cwd(), 'data', 'vehicles.json');
const tmpFile = '/tmp/auto_maestro_vehicles.json';

async function uploadUrlToCloudinary(imageUrl) {
  if (!imageUrl || imageUrl.includes('res.cloudinary.com')) {
    return imageUrl; // Already Cloudinary URL
  }

  console.log(`Uploading to Cloudinary: ${imageUrl.slice(0, 70)}...`);

  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const stringToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: imageUrl,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(` -> Success: ${data.secure_url}`);
      return data.secure_url;
    } else {
      const err = await res.json();
      console.error(` -> Cloudinary Error:`, err);
      return imageUrl;
    }
  } catch (error) {
    console.error(` -> Exception uploading ${imageUrl}:`, error.message);
    return imageUrl;
  }
}

async function migrate() {
  if (!fs.existsSync(vehiclesFile)) {
    console.error(`Vehicles file not found: ${vehiclesFile}`);
    return;
  }

  const cars = JSON.parse(fs.readFileSync(vehiclesFile, 'utf8'));
  console.log(`Starting Cloudinary migration for ${cars.length} vehicles...`);

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    console.log(`\n[${i + 1}/${cars.length}] Processing ${car.year} ${car.make} ${car.model}...`);

    if (car.mainImage) {
      car.mainImage = await uploadUrlToCloudinary(car.mainImage);
    }

    if (car.images && Array.isArray(car.images)) {
      const updatedImages = [];
      for (const img of car.images) {
        const cUrl = await uploadUrlToCloudinary(img);
        updatedImages.push(cUrl);
      }
      car.images = updatedImages;
    }
  }

  fs.writeFileSync(vehiclesFile, JSON.stringify(cars, null, 2), 'utf8');
  console.log(`\n✅ Saved updated data to ${vehiclesFile}`);

  try {
    fs.writeFileSync(tmpFile, JSON.stringify(cars, null, 2), 'utf8');
    console.log(`✅ Saved updated data to ${tmpFile}`);
  } catch (e) {
    console.warn(`Could not save to ${tmpFile}:`, e.message);
  }

  console.log('\n🎉 Migration to Cloudinary completed successfully!');
}

migrate();
