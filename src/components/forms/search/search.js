import "./search.scss"

import { bodyLockStatus, bodyLockToggle, bodyLock, bodyUnlock } from "@js/common/functions.js"

import { initHeaderHeight } from '../../layout/header/header-height.js';
initHeaderHeight();

const isMenuOpen = () => document.documentElement.hasAttribute('data-fls-menu-open');

const searchButtons = document.querySelectorAll('.search__toggle');
if (searchButtons.length > 0) {
  searchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!bodyLockStatus) return;

      const parent = btn.closest('.search');
      if (!parent) return;

      const isOpening = !parent.classList.contains('_search-active');
      parent.classList.toggle('_search-active');

      if (isOpening) {
        // если открываем поиск — закрываем каталог
        const activeCatalog = document.querySelector('.header-catalog._catalog-active');
        if (activeCatalog) {
          activeCatalog.classList.remove('_catalog-active');
          // каталог уже держал bodyLock, значит повторно не трогаем
          return;
        }

        // если меню уже открыто — скролл не трогаем (он уже залочен меню)
        if (isMenuOpen()) return;

        bodyLock();
      } else {
        // закрытие поиска: разблокируем скролл только если
        // нет открытого каталога и не открыто меню
        const stillOpenCatalog = document.querySelector('.header-catalog._catalog-active');
        if (!stillOpenCatalog && !isMenuOpen()) {
          bodyUnlock();
        }
      }
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const activeSearch = document.querySelector('.search._search-active');
    if (activeSearch) {
      bodyLockToggle();
      activeSearch.classList.remove('_search-active');
    }
  }
});