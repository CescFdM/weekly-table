import { DAYS, SLOTS, dayLabel, slotLabel } from './config.js';
import {
  modalBackdrop, modalTitleEl, modalTargetStatic, modalTargetSelect,
  modalDaySel, modalSlotSel, modalName, modalIngredients,
  modalRemoveBtn, modalCancelBtn, modalSaveBtn, newDishBtn,
} from './dom.js';
import { state, normalizeCell, getDishById } from './state.js';
import { parseIngredients } from './ingredients.js';
import { clearSlot, assignDish } from './mealGrid.js';
import { upsertDish, refreshDishPhoto } from './dishes.js';

// ---- Add/assign/edit dish modal ----

function populateDaySlotSelects() {
  modalDaySel.innerHTML = '';
  DAYS.forEach(d => {
    const o = document.createElement('option');
    o.value = d.key; o.textContent = d.label;
    modalDaySel.appendChild(o);
  });
  modalSlotSel.innerHTML = '';
  SLOTS.forEach(s => {
    const o = document.createElement('option');
    o.value = s.key; o.textContent = s.label;
    modalSlotSel.appendChild(o);
  });
}
populateDaySlotSelects();

export function showModal() {
  state.ingredientsTouched = false;
  modalBackdrop.classList.add('show');
  setTimeout(() => modalName.focus(), 0);
}
export function closeModal() {
  modalBackdrop.classList.remove('show');
  state.modalMode = null;
}

export function openSlotModal(dayKey, slotKey) {
  state.modalMode = 'slot';
  state.modalDay = dayKey; state.modalSlot = slotKey;
  const data = normalizeCell(state.meals[dayKey] && state.meals[dayKey][slotKey]);
  modalTitleEl.textContent = 'Add dish — ' + dayLabel(dayKey) + ', ' + slotLabel(slotKey);
  modalTargetStatic.style.display = 'block';
  modalTargetStatic.textContent = dayLabel(dayKey) + ' · ' + slotLabel(slotKey);
  modalTargetSelect.style.display = 'none';
  modalName.value = data.name || '';
  const dish = data.dishId ? getDishById(data.dishId) : null;
  modalIngredients.value = dish && dish.ingredients ? dish.ingredients.join('\n') : '';
  state.modalExistingDishId = data.dishId || null;
  modalRemoveBtn.style.display = data.name ? '' : 'none';
  showModal();
}

export function openLibraryAddModal() {
  state.modalMode = 'library-add';
  state.modalDay = null; state.modalSlot = null;
  state.modalExistingDishId = null;
  modalTitleEl.textContent = 'New dish';
  modalTargetStatic.style.display = 'none';
  modalTargetSelect.style.display = 'none';
  modalName.value = '';
  modalIngredients.value = '';
  modalRemoveBtn.style.display = 'none';
  showModal();
}

export function openLibraryEditModal(dish) {
  state.modalMode = 'library-edit';
  state.modalDay = null; state.modalSlot = null;
  state.modalExistingDishId = dish.id;
  modalTitleEl.textContent = 'Edit “' + dish.name + '”';
  modalTargetStatic.style.display = 'none';
  modalTargetSelect.style.display = 'none';
  modalName.value = dish.name;
  modalIngredients.value = dish.ingredients ? dish.ingredients.join('\n') : '';
  modalRemoveBtn.style.display = 'none';
  showModal();
}

export function openLibraryAssignModal(dish) {
  state.modalMode = 'library-assign';
  state.modalExistingDishId = dish.id;
  modalTitleEl.textContent = 'Add “' + dish.name + '” to the table';
  modalTargetStatic.style.display = 'none';
  modalTargetSelect.style.display = 'flex';
  modalDaySel.value = 'mon';
  modalSlotSel.value = 'breakfast';
  modalName.value = dish.name;
  modalIngredients.value = dish.ingredients ? dish.ingredients.join('\n') : '';
  modalRemoveBtn.style.display = 'none';
  showModal();
}

modalName.addEventListener('input', () => {
  if (state.modalMode === 'slot') return;
  const key = modalName.value.trim().toLowerCase();
  if (!key || state.ingredientsTouched) return;
  const match = state.dishes.find(d => d.name.toLowerCase() === key);
  if (match) modalIngredients.value = (match.ingredients || []).join('\n');
});
modalIngredients.addEventListener('input', () => { state.ingredientsTouched = true; });

modalCancelBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
modalRemoveBtn.addEventListener('click', () => {
  if (state.modalDay && state.modalSlot) clearSlot(state.modalDay, state.modalSlot);
  closeModal();
});
newDishBtn.addEventListener('click', openLibraryAddModal);

modalSaveBtn.addEventListener('click', async () => {
  const name = modalName.value.trim();
  if (!name) { modalName.focus(); return; }
  const ingredients = parseIngredients(modalIngredients.value);
  modalSaveBtn.disabled = true;
  try {
    const dish = await upsertDish(name, ingredients, state.modalExistingDishId);
    if (state.modalMode === 'slot') {
      await assignDish(state.modalDay, state.modalSlot, dish);
    } else if (state.modalMode === 'library-assign') {
      await assignDish(modalDaySel.value, modalSlotSel.value, dish);
    } else if (state.modalMode === 'library-edit') {
      refreshDishPhoto(dish.id, name, ingredients);
    }
    closeModal();
  } finally {
    modalSaveBtn.disabled = false;
  }
});
