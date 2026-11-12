// ---- Your Firebase project (free tier) — this is the shared database ----
export const firebaseConfig = {
  apiKey: "AIzaSyDdO_v4JFcqlh_NfKWlrIkVhDgoF5J72k0",
  authDomain: "weekly-table-1d8e3.firebaseapp.com",
  projectId: "weekly-table-1d8e3",
  storageBucket: "weekly-table-1d8e3.firebasestorage.app",
  messagingSenderId: "461000329634",
  appId: "1:461000329634:web:39702c4b9af9c88c6f4afb"
};

// ---- Optional: auto-fetch a photo for new dishes via Unsplash ----
// Leave blank to disable auto-photo-search (everything else still works).
export const UNSPLASH_ACCESS_KEY = 'TRG-Sy3CiNfDD7yV1zGh7_nYqARNaClNUBDt8L1CRm4';

export const DAYS = [
  { key: 'mon', dow: 'Mon', label: 'Monday' },
  { key: 'tue', dow: 'Tue', label: 'Tuesday' },
  { key: 'wed', dow: 'Wed', label: 'Wednesday' },
  { key: 'thu', dow: 'Thu', label: 'Thursday' },
  { key: 'fri', dow: 'Fri', label: 'Friday' },
  { key: 'sat', dow: 'Sat', label: 'Saturday' },
  { key: 'sun', dow: 'Sun', label: 'Sunday' },
];
export const SLOTS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'snack1', label: 'Morning snack' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snack2', label: 'Afternoon snack' },
  { key: 'dinner', label: 'Dinner' },
];
export const dayLabel = k => (DAYS.find(d => d.key === k) || {}).label || k;
export const slotLabel = k => (SLOTS.find(s => s.key === k) || {}).label || k;
