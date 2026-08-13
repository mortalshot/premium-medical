import "./headercatalog.scss"

import { bodyLockStatus, bodyLockToggle, bodyLock, bodyUnlock } from "@js/common/functions.js"

import { initHeaderHeight } from '../header/header-height.js';
initHeaderHeight();

// Открываем каталог
const catalogButtons = document.querySelectorAll('.header-catalog__toggle');
if (catalogButtons.length > 0) {
  catalogButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!bodyLockStatus) return;

      const parent = btn.closest('.header-catalog');
      if (!parent) return;

      const isOpening = !parent.classList.contains('_catalog-active');
      parent.classList.toggle('_catalog-active');

      if (isOpening) {
        // закрываем каталог при открытии поиска
        const activeSearch = document.querySelector('.search._search-active');
        if (activeSearch) activeSearch.classList.remove('_search-active');

        // Мобайл: меню уже залочило скролл — ничего не делаем.
        if (!isMenuOpen()) {
          // Десктоп: меню нет — каталог сам лочит скролл.
          bodyLock();
        }

        bodyLock(); // меню не открыто — ставим lock для поиска
      } else {
        // Закрываем каталог: разблокируем только если
        // не открыты меню и поиск.
        const stillOpenSearch = document.querySelector('.search._search-active');
        if (!isMenuOpen() && !stillOpenSearch) {
          bodyUnlock();
        }
      }
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const activeCatalog = document.querySelector('.header-catalog._catalog-active');
    if (activeCatalog) {
      bodyLockToggle();
      activeCatalog.classList.remove('_catalog-active');
    }
  }
});

// Показываем табы
const DESKTOP_MIN = 768;
const mql = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);

// Инициализация для КАЖДОГО блока tabs (если он один — тоже ок)
document.querySelectorAll('.header-catalog__tabs').forEach(initTabsBlock);

function initTabsBlock(block) {
  // важное: берём только КНОПКИ, ссылки не участвуют в индексации табов
  const btns = Array.from(block.querySelectorAll('button.header-catalog__title'));
  const bodies = Array.from(block.querySelectorAll('.header-catalog__body'));

  // --- Активировать таб по клику на кнопку
  block.addEventListener('click', (e) => {
    const btn = e.target.closest('button.header-catalog__title');
    if (!btn || !block.contains(btn)) return;

    const idx = btns.indexOf(btn);
    if (idx === -1) return;

    // сброс только активов
    btns.forEach(b => b.classList.remove('_item-active'));
    bodies.forEach(b => b.classList.remove('_item-active'));

    // активация
    btn.classList.add('_item-active');
    if (bodies[idx]) {
      bodies[idx].classList.add('_item-active');
    }
  });

  // --- Ховер по ссылке: чистим только в текущем body и ставим hover на текущий item
  block.addEventListener('pointerover', (e) => {
    const link = e.target.closest('.header-catalog__link');
    if (!link || !block.contains(link)) return;

    const body = link.closest('.header-catalog__body');
    if (!body) return;

    body.querySelectorAll('._item-hover').forEach(el => el.classList.remove('_item-hover'));
    const item = link.closest('.header-catalog__item') || link;
    item.classList.add('_item-hover');
  });

  // --- Закрытие таба на мобиле
  block.addEventListener('click', (e) => {
    const close = e.target.closest('.header-catalog__close');
    if (!close || !block.contains(close)) return;

    if (mql.matches) return;

    // ищем body, где находится кнопка закрытия
    const body = close.closest('.header-catalog__body');
    if (!body) return;

    body.classList.remove('_item-active');

    // ищем связанную кнопку
    const idx = bodies.indexOf(body);
    if (idx > -1 && btns[idx]) {
      btns[idx].classList.remove('_item-active');
    }
  });

  // --- Пресеты по брейкпоинту
  function clearAll() {
    btns.forEach(b => b.classList.remove('_item-active'));
    bodies.forEach(b => b.classList.remove('_item-active'));
    block.querySelectorAll('._item-hover').forEach(el => el.classList.remove('_item-hover'));
  }

  function setDesktopDefaults() {
    clearAll();

    // активируем первый таб (если есть) и его body
    if (btns[0]) btns[0].classList.add('_item-active');
    if (bodies[0]) bodies[0].classList.add('_item-active');

    // в каждом body подсвечиваем первый item (если есть)
    bodies.forEach(body => {
      const firstItem = body.querySelector('.header-catalog__item');
      if (firstItem) firstItem.classList.add('_item-hover');
    });
  }

  // первичный прогон
  mql.matches ? setDesktopDefaults() : clearAll();

  // реагируем ТОЛЬКО на пересечение порога 768
  const onChange = (e) => (e.matches ? setDesktopDefaults() : clearAll());
  if (mql.addEventListener) mql.addEventListener('change', onChange);
  else mql.addListener(onChange); // старые браузеры
}