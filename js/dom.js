// All DOM element lookups live here, in one place, so every other module
// just imports the references it needs instead of re-querying the page.

export const gridEl = document.getElementById('grid');
export const statusPill = document.getElementById('statusPill');
export const statusText = document.getElementById('statusText');
export const offlineBanner = document.getElementById('offlineBanner');
export const weekRangeEl = document.getElementById('weekRange');

export const shopListEl = document.getElementById('shopList');
export const shopCountEl = document.getElementById('shopCount');
export const addForm = document.getElementById('addForm');
export const addInput = document.getElementById('addInput');

export const dishGridEl = document.getElementById('dishGrid');
export const dishCountEl = document.getElementById('dishCount');
export const newDishBtn = document.getElementById('newDishBtn');
export const dishSearchInput = document.getElementById('dishSearchInput');
export const dishNamesList = document.getElementById('dishNamesList');

export const modalBackdrop = document.getElementById('modalBackdrop');
export const modalTitleEl = document.getElementById('modalTitle');
export const modalTargetStatic = document.getElementById('modalTargetStatic');
export const modalTargetSelect = document.getElementById('modalTargetSelect');
export const modalDaySel = document.getElementById('modalDaySel');
export const modalSlotSel = document.getElementById('modalSlotSel');
export const modalName = document.getElementById('modalName');
export const modalIngredients = document.getElementById('modalIngredients');
export const modalRemoveBtn = document.getElementById('modalRemoveBtn');
export const modalCancelBtn = document.getElementById('modalCancelBtn');
export const modalSaveBtn = document.getElementById('modalSaveBtn');

export const photoBackdrop = document.getElementById('photoBackdrop');
export const photoTitleEl = document.getElementById('photoTitle');
export const photoFrameEl = document.getElementById('photoFrame');
export const photoIngsEl = document.getElementById('photoIngs');
export const photoCreditEl = document.getElementById('photoCredit');
export const photoErrorEl = document.getElementById('photoError');
export const photoFileInput = document.getElementById('photoFileInput');
export const photoFindBtn = document.getElementById('photoFindBtn');
export const photoRemoveBtn = document.getElementById('photoRemoveBtn');
export const photoCloseBtn = document.getElementById('photoCloseBtn');
