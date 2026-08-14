import fs from 'fs';
import path from 'path';

const storageDir = '/home/almuxtaar/.gemini/antigravity/brain/9506d595-cf6d-4390-a261-dd6c79c5e0d0/.tempmediaStorage';
const destPath = '/home/almuxtaar/Projets/web/auto-maestro-next/public/hero-amg.jpg';

const files = fs.readdirSync(storageDir);
console.log('Files in storage:', files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg')));

// Find the jpg file or newest media file
const jpgFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
if (jpgFiles.length > 0) {
  const latestJpg = jpgFiles[jpgFiles.length - 1];
  fs.copyFileSync(path.join(storageDir, latestJpg), destPath);
  console.log('Copied', latestJpg, 'to', destPath);
}
