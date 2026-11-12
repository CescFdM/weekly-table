import { firebaseConfig } from './config.js';
import { statusPill, statusText, offlineBanner, weekRangeEl, modalBackdrop, photoBackdrop } from './dom.js';
import { state, emptyMeals } from './state.js';
import { monday, buildGrid, renderMeals } from './mealGrid.js';
import { renderShopping } from './shoppingList.js';
import { renderDishes } from './dishes.js';
import { closeModal } from './dishModal.js';
import { closePhotoModal } from './photoModal.js';

function setStatus(mode, text) {
  statusPill.dataset.mode = mode;
  statusText.textContent = text;
  offlineBanner.classList.toggle('show', mode === 'offline');
}

function formatRange(mondayDate) {
  const sunday = new Date(mondayDate);
  sunday.setDate(mondayDate.getDate() + 6);
  const mMonth = mondayDate.toLocaleDateString('en-US', { month: 'short' });
  const sMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  return mMonth === sMonth
    ? `${mMonth} ${mondayDate.getDate()}–${sunday.getDate()}`
    : `${mMonth} ${mondayDate.getDate()} – ${sMonth} ${sunday.getDate()}`;
}
weekRangeEl.textContent = formatRange(monday) + ' · this week';

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modalBackdrop.classList.contains('show')) closeModal();
  if (photoBackdrop.classList.contains('show')) closePhotoModal();
});

// ---- Boot ----

buildGrid();
renderMeals();
renderShopping();
renderDishes();
setStatus('loading', 'Connecting…');

async function init() {
  try {
    firebase.initializeApp(firebaseConfig);
    state.dbApi = firebase.firestore();
  } catch (e) {
    state.dbApi = null;
  }

  if (!state.dbApi) {
    setStatus('offline', "Couldn't connect");
    return;
  }

  state.mealRef = state.dbApi.collection('planner').doc('mealplan');
  state.shopCol = state.mealRef.collection('shopping');
  state.dishCol = state.mealRef.collection('dishes');

  try {
    const snap = await state.mealRef.get();
    if (!snap.exists) {
      await state.mealRef.set({ meals: emptyMeals(), updatedAt: new Date().toISOString() });
    }
  } catch (e) {}

  state.mealRef.onSnapshot(
    snap => {
      if (snap.exists) {
        const data = snap.data();
        state.meals = (data && data.meals) ? data.meals : emptyMeals();
        renderMeals();
      }
      setStatus('live', 'Live · shared plan');
    },
    () => setStatus('offline', 'Sync interrupted')
  );

  state.shopCol.orderBy('addedAt', 'asc').onSnapshot(
    snap => {
      state.shopping = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
      renderShopping();
    },
    () => {}
  );

  state.dishCol.orderBy('createdAt', 'asc').onSnapshot(
    snap => {
      state.dishes = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
      renderMeals();
      renderDishes();
    },
    () => {}
  );
}

init();
