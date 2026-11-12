import { DAYS, SLOTS, slotLabel } from './config.js';
import { gridEl } from './dom.js';
import { state, normalizeCell, getDishById } from './state.js';
import { mergeIngredientsIntoShopping } from './shoppingList.js';
import { openSlotModal } from './dishModal.js';

// Monday of the current week — computed once at load, used both for the
// header's date range and for the day numbers shown in the grid.
export const monday = mondayOf(new Date());

function mondayOf(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

const cellEls = {};

export function buildGrid() {
  gridEl.innerHTML = '';
  const corner = document.createElement('div');
  corner.className = 'cell corner';
  gridEl.appendChild(corner);

  DAYS.forEach((d, i) => {
    const dnum = new Date(monday);
    dnum.setDate(monday.getDate() + i);
    const col = document.createElement('div');
    col.className = 'daycol';
    col.innerHTML = `<span class="dow">${d.dow}</span><span class="dnum">${dnum.getDate()}</span>`;
    gridEl.appendChild(col);
  });

  SLOTS.forEach(slot => {
    const label = document.createElement('div');
    label.className = 'cell slotlabel';
    label.textContent = slot.label;
    gridEl.appendChild(label);

    DAYS.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const btn = document.createElement('div');
      btn.className = 'slotbtn';
      btn.tabIndex = 0;
      btn.setAttribute('role', 'button');
      btn.addEventListener('click', () => openSlotModal(day.key, slot.key));
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSlotModal(day.key, slot.key); }
      });

      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'clearx';
      clearBtn.innerHTML = '&times;';
      clearBtn.setAttribute('aria-label', 'Remove dish from ' + slot.label + ', ' + day.label);
      clearBtn.addEventListener('click', e => { e.stopPropagation(); clearSlot(day.key, slot.key); });

      btn.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        btn.classList.add('drop-hover');
      });
      btn.addEventListener('dragleave', () => btn.classList.remove('drop-hover'));
      btn.addEventListener('drop', e => {
        e.preventDefault();
        btn.classList.remove('drop-hover');
        const dishId = e.dataTransfer.getData('text/plain');
        const dish = getDishById(dishId);
        if (dish) assignDish(day.key, slot.key, dish);
      });

      const thumb = document.createElement('img');
      thumb.className = 'slotthumb';
      thumb.alt = '';

      const content = document.createElement('div');
      content.className = 'slotcontent';

      btn.appendChild(thumb);
      btn.appendChild(content);
      btn.appendChild(clearBtn);
      cell.appendChild(btn);
      gridEl.appendChild(cell);
      cellEls[day.key + ':' + slot.key] = { btn, thumb, content, clearBtn };
    });
  });
}

export function renderMeals() {
  Object.keys(cellEls).forEach(key => {
    const [dayKey, slotKey] = key.split(':');
    const data = normalizeCell(state.meals[dayKey] && state.meals[dayKey][slotKey]);
    const { btn, thumb, content, clearBtn } = cellEls[key];
    content.innerHTML = '';
    if (data.name) {
      btn.classList.remove('empty');
      const nameEl = document.createElement('span');
      nameEl.className = 'dishname';
      nameEl.textContent = data.name;
      content.appendChild(nameEl);
      const dish = data.dishId ? getDishById(data.dishId) : null;
      if (dish && dish.ingredients && dish.ingredients.length) {
        const c = document.createElement('span');
        c.className = 'ingcount';
        c.textContent = dish.ingredients.length + (dish.ingredients.length === 1 ? ' ingredient' : ' ingredients');
        content.appendChild(c);
      }
      if (dish && dish.photo) {
        thumb.src = dish.photo;
        thumb.alt = data.name;
      } else {
        thumb.removeAttribute('src');
      }
      clearBtn.style.display = '';
    } else {
      btn.classList.add('empty');
      content.textContent = '+ add ' + slotLabel(slotKey).toLowerCase();
      thumb.removeAttribute('src');
      clearBtn.style.display = 'none';
    }
  });
}

export function clearSlot(dayKey, slotKey) {
  if (!state.meals[dayKey]) state.meals[dayKey] = {};
  state.meals[dayKey][slotKey] = { dishId: null, name: '' };
  renderMeals();
  if (state.dbApi && state.mealRef) {
    const fieldPath = 'meals.' + dayKey + '.' + slotKey;
    state.mealRef.update({ [fieldPath]: { dishId: null, name: '' } }).catch(() => {});
  }
}

export async function assignDish(dayKey, slotKey, dish) {
  if (!state.meals[dayKey]) state.meals[dayKey] = {};
  state.meals[dayKey][slotKey] = { dishId: dish.id, name: dish.name };
  renderMeals();
  if (state.dbApi && state.mealRef) {
    const fieldPath = 'meals.' + dayKey + '.' + slotKey;
    state.mealRef.update({ [fieldPath]: { dishId: dish.id, name: dish.name } }).catch(() => {
      state.mealRef.set({ meals: state.meals, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    });
  }
  await mergeIngredientsIntoShopping(dish.ingredients || []);
}
