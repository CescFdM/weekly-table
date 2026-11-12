import { shopListEl, shopCountEl, addForm, addInput } from './dom.js';
import { state } from './state.js';
import { normalizeKey } from './ingredients.js';

// ---- Shopping list ----

function effectiveOrder(item) {
  return typeof item.order === 'number' ? item.order : (item.addedAt || 0);
}
function minOrderIn(list) {
  if (!list.length) return 0;
  return Math.min.apply(null, list.map(effectiveOrder));
}
function isDropBefore(e, li) {
  const rect = li.getBoundingClientRect();
  return (e.clientY - rect.top) < rect.height / 2;
}
function reorderShoppingItem(draggedId, targetId, before) {
  const dragged = state.shopping.find(i => i.id === draggedId);
  const target = state.shopping.find(i => i.id === targetId);
  if (!dragged || !target || !!dragged.checked !== !!target.checked) return;
  const section = state.shopping.filter(i => !!i.checked === !!target.checked && i.id !== draggedId)
    .sort((a, b) => effectiveOrder(a) - effectiveOrder(b));
  const idx = section.findIndex(i => i.id === targetId);
  if (idx === -1) return;
  const prev = before ? section[idx - 1] : section[idx];
  const next = before ? section[idx] : section[idx + 1];
  let newOrder;
  if (prev && next) newOrder = (effectiveOrder(prev) + effectiveOrder(next)) / 2;
  else if (next) newOrder = effectiveOrder(next) - 1;
  else if (prev) newOrder = effectiveOrder(prev) + 1;
  else newOrder = 0;
  dragged.order = newOrder;
  renderShopping();
  if (state.dbApi && state.shopCol) {
    state.shopCol.doc(draggedId).update({ order: newOrder }).catch(() => {});
  }
}

export function renderShopping() {
  shopCountEl.textContent = state.shopping.length === 1 ? '1 item' : state.shopping.length + ' items';
  shopListEl.innerHTML = '';
  if (state.shopping.length === 0) {
    const li = document.createElement('li');
    li.style.border = 'none';
    const span = document.createElement('span');
    span.className = 'empty';
    span.textContent = 'Your list is empty — add an item above, or add a dish to the table.';
    li.appendChild(span);
    shopListEl.appendChild(li);
    return;
  }

  const unchecked = state.shopping.filter(i => !i.checked).sort((a, b) => effectiveOrder(a) - effectiveOrder(b));
  const checkedItems = state.shopping.filter(i => i.checked).sort((a, b) => effectiveOrder(a) - effectiveOrder(b));

  function makeRow(item) {
    const li = document.createElement('li');
    li.draggable = true;
    if (item.checked) li.classList.add('done');

    const grip = document.createElement('span');
    grip.className = 'grip';
    grip.textContent = '⠿';
    grip.setAttribute('aria-hidden', 'true');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'box';
    cb.checked = !!item.checked;
    cb.setAttribute('aria-label', 'Mark ' + item.text + (item.checked ? ' as not bought' : ' as bought'));
    cb.addEventListener('change', () => toggleItem(item));

    const txt = document.createElement('span');
    txt.className = 'txt';
    txt.textContent = item.text;

    const rm = document.createElement('button');
    rm.className = 'rm';
    rm.type = 'button';
    rm.innerHTML = '&times;';
    rm.setAttribute('aria-label', 'Remove ' + item.text);
    rm.addEventListener('click', () => removeItem(item));

    li.appendChild(grip);
    li.appendChild(cb);
    li.appendChild(txt);
    li.appendChild(rm);

    li.addEventListener('dragstart', e => {
      state.draggingItemId = item.id;
      e.dataTransfer.setData('text/plain', item.id);
      e.dataTransfer.effectAllowed = 'move';
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => {
      state.draggingItemId = null;
      li.classList.remove('dragging');
    });
    li.addEventListener('dragover', e => {
      if (!state.draggingItemId || state.draggingItemId === item.id) return;
      const dragged = state.shopping.find(i => i.id === state.draggingItemId);
      if (!dragged || !!dragged.checked !== !!item.checked) return;
      e.preventDefault();
      const before = isDropBefore(e, li);
      li.classList.toggle('drop-before', before);
      li.classList.toggle('drop-after', !before);
    });
    li.addEventListener('dragleave', () => { li.classList.remove('drop-before', 'drop-after'); });
    li.addEventListener('drop', e => {
      e.preventDefault();
      const before = li.classList.contains('drop-before');
      li.classList.remove('drop-before', 'drop-after');
      if (state.draggingItemId && state.draggingItemId !== item.id) reorderShoppingItem(state.draggingItemId, item.id, before);
    });

    return li;
  }

  unchecked.forEach(item => shopListEl.appendChild(makeRow(item)));

  if (checkedItems.length) {
    const divider = document.createElement('li');
    divider.className = 'divider';
    divider.textContent = 'Checked';
    shopListEl.appendChild(divider);
    checkedItems.forEach(item => shopListEl.appendChild(makeRow(item)));
  }
}

export function addItem(text) {
  text = text.trim();
  if (!text) return;
  const k = normalizeKey(text);
  if (state.shopping.some(i => normalizeKey(i.text) === k)) return; // already listed, possibly in the other language
  const order = minOrderIn(state.shopping.filter(i => !i.checked)) - 1;
  if (state.dbApi && state.shopCol) {
    state.shopCol.add({ text: text, checked: false, addedAt: Date.now(), order: order }).catch(() => {});
  } else {
    state.shopping.push({ id: 'local-' + (state.localShopCounter++), text: text, checked: false, addedAt: Date.now(), order: order });
    renderShopping();
  }
}

export async function mergeIngredientsIntoShopping(ingredients) {
  if (!ingredients || !ingredients.length) return;
  const existingKeys = new Set(state.shopping.map(i => normalizeKey(i.text)));
  const toAdd = [];
  ingredients.forEach(ing => {
    const k = normalizeKey(ing);
    if (k && !existingKeys.has(k)) { existingKeys.add(k); toAdd.push(ing.trim()); }
  });
  if (!toAdd.length) return;
  const base = minOrderIn(state.shopping.filter(i => !i.checked));
  const orders = toAdd.map((_, idx) => base - (toAdd.length - idx));
  if (state.dbApi && state.shopCol) {
    for (let i = 0; i < toAdd.length; i++) {
      try { await state.shopCol.add({ text: toAdd[i], checked: false, addedAt: Date.now(), order: orders[i] }); } catch (e) {}
    }
  } else {
    toAdd.forEach((item, i) => {
      state.shopping.push({ id: 'local-' + (state.localShopCounter++), text: item, checked: false, addedAt: Date.now(), order: orders[i] });
    });
    renderShopping();
  }
}

function toggleItem(item) {
  const nowChecked = !item.checked;
  const targetGroup = state.shopping.filter(i => i.id !== item.id && !!i.checked === nowChecked);
  const newOrder = minOrderIn(targetGroup) - 1;
  if (state.dbApi && state.shopCol) {
    state.shopCol.doc(item.id).update({ checked: nowChecked, order: newOrder }).catch(() => {});
  } else {
    item.checked = nowChecked;
    item.order = newOrder;
    renderShopping();
  }
}

function removeItem(item) {
  if (state.dbApi && state.shopCol) {
    state.shopCol.doc(item.id).delete().catch(() => {});
  } else {
    state.shopping = state.shopping.filter(i => i !== item);
    renderShopping();
  }
}

addForm.addEventListener('submit', e => {
  e.preventDefault();
  addItem(addInput.value);
  addInput.value = '';
  addInput.focus();
});
