// Bilingual (EN/DE) ingredient synonym groups, each with a representative icon.
// Only true translation pairs of the SAME item are grouped (e.g. egg/Ei), never
// merged with related-but-different items (milk stays separate from cream).
export const INGREDIENT_GROUPS = [
  { icon: '🥚', terms: ['egg', 'eggs', 'ei', 'eier'] },
  { icon: '🥛', terms: ['milk', 'milch'] },
  { icon: '🥛', terms: ['cream', 'sahne'] },
  { icon: '🥛', terms: ['sour cream', 'saure sahne', 'schmand'] },
  { icon: '🧈', terms: ['butter'] },
  { icon: '🧀', terms: ['cheese', 'käse', 'kase'] },
  { icon: '🧀', terms: ['cream cheese', 'frischkäse', 'frischkase'] },
  { icon: '🌾', terms: ['flour', 'mehl'] },
  { icon: '🍬', terms: ['sugar', 'zucker'] },
  { icon: '🧂', terms: ['salt', 'salz'] },
  { icon: '🧂', terms: ['pepper', 'pfeffer'] },
  { icon: '🧅', terms: ['onion', 'onions', 'zwiebel', 'zwiebeln'] },
  { icon: '🧄', terms: ['garlic', 'knoblauch'] },
  { icon: '🍅', terms: ['tomato', 'tomatoes', 'tomate', 'tomaten'] },
  { icon: '🥔', terms: ['potato', 'potatoes', 'kartoffel', 'kartoffeln'] },
  { icon: '🍗', terms: ['chicken', 'hähnchen', 'hahnchen', 'huhn', 'hühnchen', 'huhnchen'] },
  { icon: '🍞', terms: ['bread', 'brot'] },
  { icon: '🍚', terms: ['rice', 'reis'] },
  { icon: '🍝', terms: ['pasta', 'noodles', 'nudeln'] },
  { icon: '🫒', terms: ['oil', 'öl', 'ol'] },
  { icon: '🫒', terms: ['olive oil', 'olivenöl', 'olivenol'] },
  { icon: '🥣', terms: ['yogurt', 'yoghurt', 'joghurt'] },
  { icon: '🍋', terms: ['lemon', 'lemons', 'zitrone', 'zitronen'] },
  { icon: '🍋', terms: ['lime', 'limes', 'limette', 'limetten'] },
  { icon: '🍎', terms: ['apple', 'apples', 'apfel', 'äpfel', 'apfeln'] },
  { icon: '🍌', terms: ['banana', 'bananas', 'banane', 'bananen'] },
  { icon: '🥕', terms: ['carrot', 'carrots', 'karotte', 'karotten', 'möhre', 'mohre', 'möhren', 'mohren'] },
  { icon: '🥬', terms: ['spinach', 'spinat'] },
  { icon: '🍄', terms: ['mushroom', 'mushrooms', 'pilz', 'pilze', 'champignon', 'champignons'] },
  { icon: '🎃', terms: ['pumpkin', 'kurbis', 'kürbis'] },
  { icon: '🐟', terms: ['fish', 'fisch'] },
  { icon: '🐟', terms: ['salmon', 'lachs'] },
  { icon: '🐟', terms: ['tuna', 'thunfisch'] },
  { icon: '🥩', terms: ['beef', 'rindfleisch'] },
  { icon: '🥩', terms: ['pork', 'schweinefleisch'] },
  { icon: '🥩', terms: ['minced meat', 'ground beef', 'hackfleisch'] },
  { icon: '🍯', terms: ['honey', 'honig'] },
  { icon: '🥜', terms: ['nuts', 'nüsse', 'nusse'] },
  { icon: '🥜', terms: ['almonds', 'mandeln'] },
  { icon: '🥜', terms: ['walnuts', 'walnüsse', 'walnusse'] },
  { icon: '🌾', terms: ['oats', 'haferflocken'] },
  { icon: '💧', terms: ['water', 'wasser'] },
  { icon: '🍶', terms: ['vinegar', 'essig'] },
  { icon: '🌿', terms: ['basil', 'basilikum'] },
  { icon: '🌿', terms: ['parsley', 'petersilie'] },
  { icon: '🌿', terms: ['dill'] },
  { icon: '🌿', terms: ['mint', 'minze'] },
  { icon: '🌿', terms: ['rosemary', 'rosmarin'] },
  { icon: '🌿', terms: ['thyme', 'thymian'] },
  { icon: '🌿', terms: ['oregano'] },
  { icon: '🫚', terms: ['ginger', 'ingwer'] },
  { icon: '🌶️', terms: ['chili', 'chilli'] },
  { icon: '🥒', terms: ['cucumber', 'cucumbers', 'gurke', 'gurken'] },
  { icon: '🥬', terms: ['lettuce', 'salad greens', 'salat'] },
  { icon: '🥑', terms: ['avocado', 'avocados'] },
  { icon: '🍊', terms: ['orange', 'oranges', 'orangen'] },
  { icon: '🧂', terms: ['cinnamon', 'zimt'] },
  { icon: '🧂', terms: ['vanilla', 'vanille'] },
  { icon: '🍫', terms: ['chocolate', 'schokolade'] },
  { icon: '🥓', terms: ['bacon', 'speck'] },
  { icon: '🌭', terms: ['sausage', 'sausages', 'wurst', 'würste', 'wurste'] },
  { icon: '🍖', terms: ['ham', 'schinken'] },
  { icon: '🍗', terms: ['chicken', 'huhn', 'keulen', 'flügel'] },
  { icon: '🫘', terms: ['lentils', 'linsen'] },
  { icon: '🫘', terms: ['beans', 'bohnen'] },
  { icon: '🫘', terms: ['chickpeas', 'kichererbsen'] },
  { icon: '🌾', terms: ['quinoa'] },
  { icon: '🥦', terms: ['broccoli', 'brokkoli'] },
  { icon: '🥦', terms: ['cauliflower', 'blumenkohl'] },
  { icon: '🥒', terms: ['zucchini', 'courgette'] },
  { icon: '🫑', terms: ['bell pepper', 'bell peppers', 'paprika'] },
  { icon: '🌽', terms: ['corn', 'sweetcorn', 'mais'] },
  { icon: '🫛', terms: ['peas', 'erbsen'] },
  { icon: '🥬', terms: ['celery', 'sellerie'] },
  { icon: '🥬', terms: ['leek', 'leeks', 'lauch', 'porree'] },
  { icon: '🥬', terms: ['cabbage', 'kohl', 'weißkohl', 'weisskohl'] },
  { icon: '🥬', terms: ['kale', 'grünkohl', 'grunkohl'] },
  { icon: '🧂', terms: ['mustard', 'senf'] },
  { icon: '🧂', terms: ['mayonnaise', 'mayo'] },
  { icon: '🧂', terms: ['ketchup'] },
  { icon: '🍶', terms: ['soy sauce', 'sojasauce'] },
  { icon: '🍲', terms: ['stock', 'broth', 'brühe', 'bruhe'] },
  { icon: '🍷', terms: ['wine', 'wein'] },
  { icon: '🍞', terms: ['yeast', 'hefe'] },
  { icon: '🧂', terms: ['baking powder', 'backpulver'] },
  { icon: '🌽', terms: ['cornstarch', 'corn starch', 'speisestärke', 'speisestarke', 'maisstärke', 'maisstarke'] },
  { icon: '🍤', terms: ['shrimp', 'shrimps', 'prawns', 'garnelen'] },
  { icon: '🫘', terms: ['tofu'] },
  { icon: '🥥', terms: ['coconut milk', 'kokosmilch'] },
];

export const TERM_INDEX = new Map();
INGREDIENT_GROUPS.forEach((g, i) => g.terms.forEach(t => TERM_INDEX.set(t, i)));

export function normalizeKey(text) {
  const t = (text || '').trim().toLowerCase();
  return TERM_INDEX.has(t) ? 'g' + TERM_INDEX.get(t) : t;
}
export function groupFor(text) {
  const t = (text || '').trim().toLowerCase();
  return TERM_INDEX.has(t) ? INGREDIENT_GROUPS[TERM_INDEX.get(t)] : null;
}
export function dishIconsFor(dish) {
  const icons = [], seen = new Set();
  (dish.ingredients || []).forEach(ing => {
    const g = groupFor(ing);
    if (g && !seen.has(g.icon)) { seen.add(g.icon); icons.push(g.icon); }
  });
  if (!icons.length) icons.push('🍽️');
  return icons.slice(0, 4);
}

export const TINT_CLASSES = ['tint-accent', 'tint-herb', 'tint-paprika'];
export function tintFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINT_CLASSES[h % TINT_CLASSES.length];
}

export function parseIngredients(text) {
  const raw = text.split(/\n|,/).map(s => s.trim()).filter(Boolean);
  const seen = new Set();
  const out = [];
  raw.forEach(i => {
    const k = normalizeKey(i);
    if (!seen.has(k)) { seen.add(k); out.push(i); }
  });
  return out;
}

// Unsplash's own search text index is English-only. A German dish name
// (even a single compound word like "Pilzrisotto") can find nothing even
// though plenty of matching photos exist, tagged in English ("mushroom
// risotto"). Reuse the same bilingual food-term dictionary built for the
// shopping list (INGREDIENT_GROUPS / TERM_INDEX) to swap any recognized
// German fragment — even inside a compound word, with no spaces — for its
// English equivalent before searching.
const SEARCH_TERMS = Array.from(TERM_INDEX.keys()).filter(t => t.length >= 3).sort((a, b) => b.length - a.length);
export function anglicizeForSearch(text) {
  let result = ' ' + (text || '').toLowerCase() + ' ';
  SEARCH_TERMS.forEach(term => {
    if (result.indexOf(term) === -1) return;
    const english = INGREDIENT_GROUPS[TERM_INDEX.get(term)].terms[0];
    if (english && english !== term) result = result.split(term).join(' ' + english + ' ');
  });
  return result.replace(/\s+/g, ' ').trim();
}

// ---- Dish search (fuzzy, bilingual) ----
// Splits text into both its raw words and its anglicized words, so a
// search term matches whichever side (German or English) it's typed in,
// and even inside a compound word (e.g. "Rühreier" -> "egg" matches
// a dish called "Scrambled Eggs").
export function searchTokens(text) {
  const raw = (text || '').toLowerCase();
  const combined = raw + ' ' + anglicizeForSearch(text);
  return combined.split(/[^a-z0-9äöüß]+/).filter(w => w.length >= 3);
}
export function dishMatchesQuery(dish, query) {
  if (!query) return true;
  const qTokens = searchTokens(query);
  if (!qTokens.length) return true;
  const dishText = dish.name + ' ' + (dish.ingredients || []).join(' ');
  const dishHaystack = dishText.toLowerCase() + ' ' + anglicizeForSearch(dishText);
  return qTokens.some(t => dishHaystack.indexOf(t) !== -1);
}
