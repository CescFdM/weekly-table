import { UNSPLASH_ACCESS_KEY } from './config.js';
import {
  photoBackdrop, photoTitleEl, photoFrameEl, photoIngsEl, photoCreditEl,
  photoErrorEl, photoFileInput, photoFindBtn, photoRemoveBtn, photoCloseBtn,
} from './dom.js';
import { state, getDishById } from './state.js';
import { tintFor, dishIconsFor } from './ingredients.js';
import { searchDishImage } from './unsplash.js';
import { renderDishes } from './dishes.js';

// ---- Photo modal ----

function renderPhotoFrame(dish) {
  photoFrameEl.innerHTML = '';
  photoFrameEl.className = 'photo-frame';
  if (dish.photo) {
    const img = document.createElement('img');
    img.src = dish.photo;
    img.alt = dish.name;
    photoFrameEl.appendChild(img);
  } else {
    photoFrameEl.classList.add(tintFor(dish.name));
    const wrap = document.createElement('span');
    wrap.className = 'thumb-icons big';
    dishIconsFor(dish).forEach(ic => { const s = document.createElement('span'); s.textContent = ic; wrap.appendChild(s); });
    photoFrameEl.appendChild(wrap);
  }
}

function renderPhotoCredit(dish) {
  if (dish.photoCredit && dish.photoCredit.name) {
    const link = (href, label) => '<a href="' + href + '?utm_source=weekly_table&utm_medium=referral" target="_blank" rel="noopener">' + label + '</a>';
    photoCreditEl.innerHTML = 'Photo by ' + link(dish.photoCredit.userLink, dish.photoCredit.name) + ' on ' + link(dish.photoCredit.photoLink, 'Unsplash');
    photoCreditEl.style.display = '';
  } else {
    photoCreditEl.innerHTML = '';
    photoCreditEl.style.display = 'none';
  }
}

export function openPhotoModal(dish) {
  state.photoDishId = dish.id;
  photoTitleEl.textContent = dish.name;
  renderPhotoFrame(dish);
  photoIngsEl.textContent = (dish.ingredients && dish.ingredients.length) ? dish.ingredients.join(', ') : 'No ingredients listed';
  renderPhotoCredit(dish);
  photoRemoveBtn.style.display = dish.photo ? '' : 'none';
  photoFindBtn.style.display = (!dish.photo && UNSPLASH_ACCESS_KEY) ? '' : 'none';
  photoErrorEl.classList.remove('show');
  photoBackdrop.classList.add('show');
}
export function closePhotoModal() {
  photoBackdrop.classList.remove('show');
  state.photoDishId = null;
}

function resizeImageFile(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h) { if (w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; } }
        else { if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; } }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function setDishPhoto(dishId, dataUrl) {
  const dish = getDishById(dishId);
  if (dish) { dish.photo = dataUrl; dish.photoCredit = null; }
  if (state.dbApi && state.dishCol) {
    try {
      await state.dishCol.doc(dishId).update({ photo: dataUrl, photoCredit: null });
    } catch (e) {
      photoErrorEl.textContent = 'That photo was too large to save — try a smaller image.';
      photoErrorEl.classList.add('show');
      return;
    }
  }
  renderDishes();
  if (photoBackdrop.classList.contains('show') && state.photoDishId === dishId && dish) {
    renderPhotoFrame(dish);
    renderPhotoCredit(dish);
    photoRemoveBtn.style.display = '';
    photoFindBtn.style.display = 'none';
  }
}

photoFileInput.addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file || !state.photoDishId) return;
  photoErrorEl.classList.remove('show');
  try {
    const dataUrl = await resizeImageFile(file, 640, 0.75);
    await setDishPhoto(state.photoDishId, dataUrl);
  } catch (err) {
    photoErrorEl.textContent = "Couldn't read that image — try a different file.";
    photoErrorEl.classList.add('show');
  }
});

photoRemoveBtn.addEventListener('click', async () => {
  const id = state.photoDishId;
  const dish = getDishById(id);
  if (dish) { dish.photo = null; dish.photoCredit = null; }
  if (state.dbApi && state.dishCol) {
    try { await state.dishCol.doc(id).update({ photo: null, photoCredit: null }); } catch (e) {}
  }
  renderDishes();
  if (dish) { renderPhotoFrame(dish); renderPhotoCredit(dish); }
  photoRemoveBtn.style.display = 'none';
  photoFindBtn.style.display = UNSPLASH_ACCESS_KEY ? '' : 'none';
});

photoFindBtn.addEventListener('click', async () => {
  const id = state.photoDishId;
  const dish = getDishById(id);
  if (!dish) return;
  photoErrorEl.classList.remove('show');
  photoFindBtn.disabled = true;
  const originalLabel = photoFindBtn.textContent;
  photoFindBtn.textContent = 'Searching…';
  try {
    const result = await searchDishImage(dish.name, dish.ingredients);
    if (result && result.url) {
      if (state.dbApi && state.dishCol) {
        try { await state.dishCol.doc(id).update({ photo: result.url, photoCredit: result.credit }); } catch (e) {}
      }
      dish.photo = result.url;
      dish.photoCredit = result.credit;
      renderDishes();
      if (state.photoDishId === id) {
        renderPhotoFrame(dish);
        renderPhotoCredit(dish);
        photoRemoveBtn.style.display = '';
        photoFindBtn.style.display = 'none';
      }
    } else {
      photoErrorEl.textContent = 'No matching photo found on Unsplash.';
      photoErrorEl.classList.add('show');
    }
  } finally {
    photoFindBtn.disabled = false;
    photoFindBtn.textContent = originalLabel;
  }
});

photoCloseBtn.addEventListener('click', closePhotoModal);
photoBackdrop.addEventListener('click', e => { if (e.target === photoBackdrop) closePhotoModal(); });
