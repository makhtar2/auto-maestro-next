import fs from 'fs';
import path from 'path';

const LOCAL_VEHICLES_FILE = path.join(process.cwd(), 'data', 'vehicles.json');
const TMP_VEHICLES_FILE = path.join('/tmp', 'auto_maestro_vehicles.json');

const LOCAL_INQUIRIES_FILE = path.join(process.cwd(), 'data', 'inquiries.json');
const TMP_INQUIRIES_FILE = path.join('/tmp', 'auto_maestro_inquiries.json');

// Memory cache
globalThis._vehicles_cache = globalThis._vehicles_cache || null;
globalThis._inquiries_cache = globalThis._inquiries_cache || null;

export function readVehicles() {
  if (globalThis._vehicles_cache) {
    return globalThis._vehicles_cache;
  }

  // Try /tmp first
  try {
    if (fs.existsSync(TMP_VEHICLES_FILE)) {
      const data = fs.readFileSync(TMP_VEHICLES_FILE, 'utf8');
      const parsed = JSON.parse(data || '[]');
      globalThis._vehicles_cache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('[DB] Error reading vehicles from /tmp:', err);
  }

  // Fallback to local
  try {
    if (fs.existsSync(LOCAL_VEHICLES_FILE)) {
      const data = fs.readFileSync(LOCAL_VEHICLES_FILE, 'utf8');
      const parsed = JSON.parse(data || '[]');
      globalThis._vehicles_cache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('[DB] Error reading local vehicles:', err);
  }

  return [];
}

export function writeVehicles(data) {
  globalThis._vehicles_cache = data;

  // Write to /tmp
  try {
    const dir = path.dirname(TMP_VEHICLES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TMP_VEHICLES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error writing vehicles to /tmp:', err);
  }

  // Write to local in dev
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dir = path.dirname(LOCAL_VEHICLES_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOCAL_VEHICLES_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('[DB] Error writing local vehicles:', err);
    }
  }
}

export function readInquiries() {
  if (globalThis._inquiries_cache) {
    return globalThis._inquiries_cache;
  }

  // Try /tmp first
  try {
    if (fs.existsSync(TMP_INQUIRIES_FILE)) {
      const data = fs.readFileSync(TMP_INQUIRIES_FILE, 'utf8');
      const parsed = JSON.parse(data || '[]');
      globalThis._inquiries_cache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('[DB] Error reading inquiries from /tmp:', err);
  }

  // Fallback to local
  try {
    if (fs.existsSync(LOCAL_INQUIRIES_FILE)) {
      const data = fs.readFileSync(LOCAL_INQUIRIES_FILE, 'utf8');
      const parsed = JSON.parse(data || '[]');
      globalThis._inquiries_cache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('[DB] Error reading local inquiries:', err);
  }

  return [];
}

export function writeInquiries(data) {
  globalThis._inquiries_cache = data;

  // Write to /tmp
  try {
    const dir = path.dirname(TMP_INQUIRIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TMP_INQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error writing inquiries to /tmp:', err);
  }

  // Write to local in dev
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dir = path.dirname(LOCAL_INQUIRIES_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOCAL_INQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('[DB] Error writing local inquiries:', err);
    }
  }
}
