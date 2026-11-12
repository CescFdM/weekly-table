import { dishGridEl, dishCountEl, dishNamesList, dishSearchInput } from './dom.js';
import { state, getDishById } from './state.js';
import { dishIconsFor, tintFor, dishMatchesQuery } from './ingredients.js';
import { searchDishImage } from './unsplash.js';
import { openLibraryEditModal, openLibraryAssignModal } from './dishModal.js';
import { openPhotoModal } from './photoModal.js';

export function refreshDishNamesList() {
  dishNamesList.innerHTML = '';
  state.dishes.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name;
    dishNamesList.appendChild(opt);
  });
}

export function renderDishes() {
  refreshDishNamesList();
  const sorted = [...state.dishes].sort((a, b) => a.name.localeCompare(b.name));
  const query = state.dishSearchQuery.trim();
  const visible = query ? sorted.filter(d => dishMatchesQuery(d, query)) : sorted;
  const totalLabel = state.dishes.length === 1 ? '1 dish' : state.dishes.length + ' dishes';
  dishCountEl.textContent = query ? visible.length + ' of ' + totalLabel : totalLabel;
  dishGridEl.innerHTML = '';
  if (!state.dishes.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No dishes yet — add one here, or add a new dish straight into a slot in the table above.';
    dishGridEl.appendChild(p);
    return;
  }
  if (!visible.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No dishes match “' + query + '”.';
    dishGridEl.appendChild(p);
    return;
  }
  visible.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.draggable = true;
    card.title = 'Drag onto a day and meal in the table above';
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', dish.id);
      e.dataTransfer.effectAllowed = 'copy';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'dish-thumb';
    thumb.setAttribute('aria-label', 'View picture of ' + dish.name);
    if (dish.photo) {
      const img = document.createElement('img');
      img.src = dish.photo;
      img.alt = dish.name;
      thumb.appendChild(img);
    } else {
      thumb.classList.add(tintFor(dish.name));
      const icons = dishIconsFor(dish);
      const wrap = document.createElement('span');
      wrap.className = 'thumb-icons';
      wrap.style.fontSize = icons.length <= 1 ? '2.6rem' : icons.length === 2 ? '2.1rem' : icons.length === 3 ? '1.7rem' : '1.4rem';
      icons.forEach(ic => { const s = document.createElement('span'); s.textContent = ic; wrap.appendChild(s); });
      thumb.appendChild(wrap);
    }
    thumb.addEventListener('click', () => openPhotoModal(dish));

    const body = document.createElement('div');
    body.className = 'dish-body';

    const nameEl = document.createElement('div');
    nameEl.className = 'dname';
    nameEl.textContent = dish.name;

    const ingEl = document.createElement('div');
    ingEl.className = 'ding';
    ingEl.textContent = (dish.ingredients && dish.ingredients.length) ? dish.ingredients.join(', ') : 'No ingredients listed';

    const actions = document.createElement('div');
    actions.className = 'dactions';

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'edit';
    edit.textContent = 'Edit';
    edit.setAttribute('aria-label', 'Edit ' + dish.name);
    edit.addEventListener('click', () => openLibraryEditModal(dish));

    const pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'pick';
    pick.textContent = 'Add to table';
    pick.addEventListener('click', () => openLibraryAssignModal(dish));

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'del';
    del.innerHTML = '&times;';
    del.setAttribute('aria-label', 'Delete ' + dish.name + ' from your dishes');
    del.addEventListener('click', () => deleteDish(dish));

    actions.appendChild(edit);
    actions.appendChild(pick);
    actions.appendChild(del);
    body.appendChild(nameEl);
    body.appendChild(ingEl);
    body.appendChild(actions);

    card.appendChild(thumb);
    card.appendChild(body);
    dishGridEl.appendChild(card);
  });
}

dishSearchInput.addEventListener('input', () => {
  state.dishSearchQuery = dishSearchInput.value;
  renderDishes();
});

export async function fetchAndSetDishPhoto(dishId, name, ingredients) {
  const result = await searchDishImage(name, ingredients);
  if (!result || !result.url) return;
  if (state.dbApi && state.dishCol) {
    try {
      const snap = await state.dishCol.doc(dishId).get();
      if (snap.exists && !snap.data().photo) {
        await state.dishCol.doc(dishId).update({ photo: result.url, photoCredit: result.credit });
      }
    } catch (e) {}
  } else {
    const d = getDishById(dishId);
    if (d && !d.photo) { d.photo = result.url; d.photoCredit = result.credit; renderDishes(); }
  }
}

// Unlike fetchAndSetDishPhoto (new dishes only, never overwrites), this
// always replaces the photo — used when a dish is edited and saved, so a
// rename (e.g. "Eier" -> "Scrambled Eggs") gets a freshly matched photo
// instead of keeping whatever was found under the old name.
export async function refreshDishPhoto(dishId, name, ingredients) {
  const result = await searchDishImage(name, ingredients);
  if (!result || !result.url) return;
  if (state.dbApi && state.dishCol) {
    try { await state.dishCol.doc(dishId).update({ photo: result.url, photoCredit: result.credit }); } catch (e) {}
  } else {
    const d = getDishById(dishId);
    if (d) { d.photo = result.url; d.photoCredit = result.credit; renderDishes(); }
  }
}

export async function upsertDish(name, ingredients, existingId) {
  // Editing a dish that's already linked to a slot (or opened from the
  // library) always updates that exact dish record, even if its name
  // changed — never creates a second one.
  if (existingId && getDishById(existingId)) {
    const existing = getDishById(existingId);
    if (state.dbApi && state.dishCol) {
      await state.dishCol.doc(existingId).update({ name: name, ingredients: ingredients, updatedAt: Date.now() });
    } else {
      existing.name = name;
      existing.ingredients = ingredients;
      renderDishes();
    }
    return { id: existingId, name: name, ingredients: ingredients, photo: existing.photo || null };
  }

  const key = name.toLowerCase();
  const existingByName = state.dishes.find(d => d.name.toLowerCase() === key);
  if (state.dbApi && state.dishCol) {
    if (existingByName) {
      await state.dishCol.doc(existingByName.id).update({ name: name, ingredients: ingredients, updatedAt: Date.now() });
      return { id: existingByName.id, name: name, ingredients: ingredients, photo: existingByName.photo || null };
    }
    const ref = await state.dishCol.add({ name: name, ingredients: ingredients, createdAt: Date.now() });
    fetchAndSetDishPhoto(ref.id, name, ingredients);
    return { id: ref.id, name: name, ingredients: ingredients, photo: null };
  }
  if (existingByName) {
    existingByName.name = name;
    existingByName.ingredients = ingredients;
    renderDishes();
    return existingByName;
  }
  const d = { id: 'local-dish-' + (state.localDishCounter++), name: name, ingredients: ingredients, photo: null };
  state.dishes.push(d);
  renderDishes();
  fetchAndSetDishPhoto(d.id, name, ingredients);
  return d;
}

export function deleteDish(dish) {
  if (state.dbApi && state.dishCol) {
    state.dishCol.doc(dish.id).delete().catch(() => {});
  } else {
    state.dishes = state.dishes.filter(d => d.id !== dish.id);
    renderDishes();
  }
}
