import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    const fleetJpgPath = '/home/almuxtaar/.gemini/antigravity/brain/9506d595-cf6d-4390-a261-dd6c79c5e0d0/media__1786739163418.jpg';
    const fallbackPngPath = '/home/almuxtaar/.gemini/antigravity/brain/9506d595-cf6d-4390-a261-dd6c79c5e0d0/media__1786739074696.png';
    
    let targetPath = fleetJpgPath;
    if (!fs.existsSync(targetPath)) targetPath = fallbackPngPath;

    if (fs.existsSync(targetPath)) {
      const fileBuffer = fs.readFileSync(targetPath);
      const isPng = targetPath.endsWith('.png');
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': isPng ? 'image/png' : 'image/jpeg',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  } catch (error) {
    console.error('Error serving hero image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
