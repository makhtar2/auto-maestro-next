import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { checkAuth } from '../../../lib/auth-helper';

export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files (JPG, PNG, WEBP, etc.) are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 1. Try Cloudinary Upload
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (cloudName) {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      try {
        let payload = {};

        if (apiKey && apiSecret) {
          // Signed upload via API Key + API Secret
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const stringToSign = `timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

          payload = {
            file: base64File,
            api_key: apiKey,
            timestamp: timestamp,
            signature: signature
          };
        } else if (uploadPreset) {
          // Unsigned upload via preset
          payload = {
            file: base64File,
            upload_preset: uploadPreset
          };
        }

        if (payload.file) {
          const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const data = await response.json();
            return NextResponse.json({ url: data.secure_url });
          } else {
            const errorData = await response.json();
            console.error('[Cloudinary Error]', errorData);
          }
        }
      } catch (cloudErr) {
        console.error('[Cloudinary Fetch Exception]', cloudErr);
      }
    }

    // 2. Fallback: Save file locally in public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = path.extname(file.name) || '.jpg';
    const fileName = `car-${Date.now()}-${Math.floor(Math.random() * 10000)}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: 'Failed to process file upload.' }, { status: 500 });
  }
}
