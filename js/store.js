/* ============================================================
   AK PHOTOGRAPHY — Photo store
   Photos live in localStorage under "ak_photos" as an array of:
   { id, src (base64 or url), title, category, caption, date }
   A small seed set ships so the gallery isn't empty on first load.
   ============================================================ */

const AK_STORE_KEY = "ak_photos";

const AK_SEED_PHOTOS = [
  { id: "seed-1", src: "images/seed-01.jpg", title: "Skyline, Blue Hour", category: "Urban", caption: "Toronto, ON — shot 35mm", date: "2026-04-02" },
  { id: "seed-2", src: "images/seed-02.jpg", title: "Quiet Platform", category: "Street", caption: "Union Station — 6:14am", date: "2026-03-18" },
  { id: "seed-3", src: "images/seed-03.jpg", title: "Portrait No. 4", category: "Portrait", caption: "Studio light, single source", date: "2026-02-27" },
  { id: "seed-4", src: "images/seed-04.jpg", title: "Lakeside Fog", category: "Landscape", caption: "Lake Ontario, sunrise", date: "2026-01-09" },
  { id: "seed-5", src: "images/seed-05.jpg", title: "Glass & Steel", category: "Urban", caption: "Financial District", date: "2025-12-14" },
  { id: "seed-6", src: "images/seed-06.jpg", title: "Crosswalk Study", category: "Street", caption: "Queen St W", date: "2025-11-30" },
];

function akGetPhotos() {
  try {
    const raw = localStorage.getItem(AK_STORE_KEY);
    const uploaded = raw ? JSON.parse(raw) : [];
    return [...uploaded, ...AK_SEED_PHOTOS];
  } catch (e) {
    console.error("AK store read failed:", e);
    return AK_SEED_PHOTOS;
  }
}

function akGetUploadedOnly() {
  try {
    const raw = localStorage.getItem(AK_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function akSavePhotos(photos) {
  try {
    localStorage.setItem(AK_STORE_KEY, JSON.stringify(photos));
    return true;
  } catch (e) {
    console.error("AK store write failed:", e);
    return false;
  }
}

function akAddPhotos(newPhotos) {
  const existing = akGetUploadedOnly();
  const merged = [...newPhotos, ...existing];
  return akSavePhotos(merged);
}

function akDeletePhoto(id) {
  const existing = akGetUploadedOnly();
  const filtered = existing.filter((p) => p.id !== id);
  return akSavePhotos(filtered);
}

function akCategories(photos) {
  const set = new Set(photos.map((p) => p.category).filter(Boolean));
  return ["All", ...Array.from(set)];
}
