import { UNSPLASH_ACCESS_KEY } from './config.js';
import { anglicizeForSearch } from './ingredients.js';

// ---- Auto photo search (Unsplash) ----
function pickBestPhoto(results, queryText) {
  // The API's top-ranked hit is sometimes a generic photo (e.g. plain
  // "eggs" for a query like "Scrambled Eggs"). Re-rank a batch of
  // candidates by how many significant words from the search text actually
  // appear in each photo's own description/alt text/tags, and prefer
  // that match over blindly trusting result #1.
  const words = queryText.toLowerCase().split(/[^a-zA-Zäöüß]+/).filter(w => w.length > 2);
  if (!words.length) return results[0] || null;
  let best = null, bestScore = -1;
  results.forEach(r => {
    const text = [r.description, r.alt_description, (r.tags || []).map(t => t.title).join(' ')]
      .filter(Boolean).join(' ').toLowerCase();
    const score = words.reduce((s, w) => s + (text.includes(w) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = r; }
  });
  return bestScore > 0 ? best : (results[0] || null);
}

async function unsplashSearch(query) {
  const url = 'https://api.unsplash.com/search/photos?per_page=8&query=' + encodeURIComponent(query);
  const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + UNSPLASH_ACCESS_KEY } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data && data.results) || [];
}

export async function searchDishImage(name, ingredients) {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const rawQuery = (name || '').toLowerCase().trim();
    const anglicized = anglicizeForSearch(name);
    // No orientation filter: the photo frame crops any shape to fit
    // (object-fit: cover), and filtering to "squarish" was needlessly
    // narrowing the candidate pool, which is part of why a generic photo
    // could outrank the better, more specific matches.
    let results = await unsplashSearch(anglicized || rawQuery);
    let queryUsed = anglicized || rawQuery;
    if (!results.length && anglicized !== rawQuery) {
      results = await unsplashSearch(rawQuery);
      queryUsed = rawQuery;
    }
    if (!results.length && ingredients && ingredients.length) {
      const fromIngredients = anglicizeForSearch(ingredients.join(' '));
      if (fromIngredients) {
        results = await unsplashSearch(fromIngredients);
        queryUsed = fromIngredients;
      }
    }
    if (!results.length) return null;
    const photo = pickBestPhoto(results, queryUsed);
    if (!photo || !photo.urls) return null;
    if (photo.links && photo.links.download_location) {
      // Unsplash API guideline: ping this whenever a photo is put to use.
      fetch(photo.links.download_location + '&client_id=' + encodeURIComponent(UNSPLASH_ACCESS_KEY)).catch(() => {});
    }
    return {
      url: photo.urls.small || photo.urls.regular,
      credit: {
        name: (photo.user && photo.user.name) || 'Unsplash',
        userLink: (photo.user && photo.user.links && photo.user.links.html) || 'https://unsplash.com',
        photoLink: (photo.links && photo.links.html) || 'https://unsplash.com'
      }
    };
  } catch (e) {
    return null;
  }
}
