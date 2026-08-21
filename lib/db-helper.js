import fs from 'fs';
import path from 'path';

const LOCAL_VEHICLES_FILE = path.join(process.cwd(), 'data', 'vehicles.json');
const TMP_VEHICLES_FILE = path.join('/tmp', 'auto_maestro_vehicles.json');

const LOCAL_INQUIRIES_FILE = path.join(process.cwd(), 'data', 'inquiries.json');
const TMP_INQUIRIES_FILE = path.join('/tmp', 'auto_maestro_inquiries.json');

// In-Memory cache
globalThis._vehicles_cache = globalThis._vehicles_cache || null;
globalThis._inquiries_cache = globalThis._inquiries_cache || null;

// Helper to get initial seed data from disk
function getInitialVehiclesFromDisk() {
  try {
    if (fs.existsSync(LOCAL_VEHICLES_FILE)) {
      const data = fs.readFileSync(LOCAL_VEHICLES_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('[DB] Error reading local vehicles file:', e);
  }
  return [];
}

function getInitialInquiriesFromDisk() {
  try {
    if (fs.existsSync(LOCAL_INQUIRIES_FILE)) {
      const data = fs.readFileSync(LOCAL_INQUIRIES_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('[DB] Error reading local inquiries file:', e);
  }
  return [];
}

// ----------------------------------------------------
// KV / Upstash Remote Persistence Helpers
// ----------------------------------------------------
function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
}

async function kvGet(key) {
  const kv = getKvConfig();
  if (!kv) return null;
  try {
    const res = await fetch(`${kv.url}/get/${key}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.result) {
      return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    }
  } catch (err) {
    console.warn(`[DB KV] Error fetching key "${key}":`, err.message);
  }
  return null;
}

async function kvSet(key, value) {
  const kv = getKvConfig();
  if (!kv) return false;
  try {
    const res = await fetch(`${kv.url}/set/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(value))
    });
    return res.ok;
  } catch (err) {
    console.error(`[DB KV] Error setting key "${key}":`, err.message);
    return false;
  }
}

// ----------------------------------------------------
// GitHub Auto-Commit Persistence (Optional Sync)
// ----------------------------------------------------
async function syncToGitHub(filePath, content, message) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'makhtar2/auto-maestro-next';
  if (!token || !repo) return;

  try {
    // 1. Get current file sha
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'AutoMaestro-Admin'
      }
    });

    let sha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const payload = {
      message: message || `Auto update ${filePath} from Admin Terminal`,
      content: Buffer.from(content).toString('base64'),
      branch: 'main'
    };
    if (sha) payload.sha = sha;

    await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'AutoMaestro-Admin'
      },
      body: JSON.stringify(payload)
    });
  } catch (ghErr) {
    console.warn('[DB GitHub Sync] Warning:', ghErr.message);
  }
}

// ----------------------------------------------------
// VEHICLES CRUD FUNCTIONS
// ----------------------------------------------------
export async function getVehiclesAsync() {
  // 1. Try KV / Upstash if configured
  const remote = await kvGet('auto_maestro_vehicles');
  if (remote && Array.isArray(remote)) {
    globalThis._vehicles_cache = remote;
    return remote;
  }

  // 2. Read synchronous fallback
  const local = readVehicles();
  
  // Auto-seed remote KV if empty
  if (getKvConfig() && local.length > 0) {
    kvSet('auto_maestro_vehicles', local).catch(() => {});
  }

  return local;
}

export function readVehicles() {
  if (globalThis._vehicles_cache && Array.isArray(globalThis._vehicles_cache) && globalThis._vehicles_cache.length > 0) {
    return globalThis._vehicles_cache;
  }

  // Try /tmp first
  try {
    if (fs.existsSync(TMP_VEHICLES_FILE)) {
      const data = fs.readFileSync(TMP_VEHICLES_FILE, 'utf8');
      const parsed = JSON.parse(data || '[]');
      if (parsed.length > 0) {
        globalThis._vehicles_cache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[DB] Error reading vehicles from /tmp:', err);
  }

  // Fallback to local disk file
  const diskData = getInitialVehiclesFromDisk();
  globalThis._vehicles_cache = diskData;
  return diskData;
}

export async function writeVehiclesAsync(data) {
  writeVehicles(data);

  // Sync to KV
  if (getKvConfig()) {
    await kvSet('auto_maestro_vehicles', data);
  }

  // Sync to GitHub if token configured
  syncToGitHub('data/vehicles.json', JSON.stringify(data, null, 2), 'Admin: Update vehicles inventory').catch(() => {});
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
  try {
    const dir = path.dirname(LOCAL_VEHICLES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_VEHICLES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // In production read-only filesystem, ignore write error
  }
}

// ----------------------------------------------------
// INQUIRIES / LEADS CRUD FUNCTIONS
// ----------------------------------------------------
export async function getInquiriesAsync() {
  // 1. Try KV / Upstash if configured
  const remote = await kvGet('auto_maestro_inquiries');
  if (remote && Array.isArray(remote)) {
    globalThis._inquiries_cache = remote;
    return remote;
  }

  const local = readInquiries();

  if (getKvConfig() && local.length > 0) {
    kvSet('auto_maestro_inquiries', local).catch(() => {});
  }

  return local;
}

export function readInquiries() {
  if (globalThis._inquiries_cache && Array.isArray(globalThis._inquiries_cache)) {
    return globalThis._inquiries_cache;
  }

  // Try /tmp
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

  // Fallback to local disk file
  const diskData = getInitialInquiriesFromDisk();
  globalThis._inquiries_cache = diskData;
  return diskData;
}

export async function writeInquiriesAsync(data) {
  writeInquiries(data);

  if (getKvConfig()) {
    await kvSet('auto_maestro_inquiries', data);
  }

  syncToGitHub('data/inquiries.json', JSON.stringify(data, null, 2), 'Admin: Update customer leads').catch(() => {});
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
  try {
    const dir = path.dirname(LOCAL_INQUIRIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_INQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // In production read-only filesystem, ignore write error
  }
}
