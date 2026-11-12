// Single shared, mutable app state. Every other module imports `state` and
// reads/writes its properties directly (the object reference never changes,
// only its contents) — this is the one "model" all the render/controller
// modules work against.
import { DAYS, SLOTS } from './config.js';

export function emptyMeals() {
  const m = {};
  DAYS.forEach(d => {
    m[d.key] = {};
    SLOTS.forEach(s => { m[d.key][s.key] = { dishId: null, name: '' }; });
  });
  return m;
}

export function normalizeCell(v) {
  if (!v) return { dishId: null, name: '' };
  if (typeof v === 'string') return { dishId: null, name: v };
  return { dishId: v.dishId || null, name: v.name || '' };
}

export const state = {
  meals: emptyMeals(),
  shopping: [],
  dishes: [],

  // Firestore handles (null until init() connects, or forever null = local-only mode)
  dbApi: null,
  mealRef: null,
  shopCol: null,
  dishCol: null,

  // Local-only fallback id counters (used only when Firestore isn't available)
  localShopCounter: 1,
  localDishCounter: 1,

  // Add/assign/edit dish modal state
  modalMode: null,
  modalDay: null,
  modalSlot: null,
  modalExistingDishId: null,
  ingredientsTouched: false,

  // Photo modal state
  photoDishId: null,

  // Shopping list drag-and-drop state
  draggingItemId: null,

  // Dish search box state
  dishSearchQuery: '',
};

export function getDishById(id) {
  return state.dishes.find(d => d.id === id) || null;
}
