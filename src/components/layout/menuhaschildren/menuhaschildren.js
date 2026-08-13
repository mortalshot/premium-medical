import "./menuhaschildren.scss"

const mql = matchMedia('(min-width: 768px)');

function isDesktop() { return mql.matches; }

// Синхронизация режимов при загрузке и ресайзе
function syncMode() {
  document.querySelectorAll('.menu__sub-list').forEach(ul => {
    if (isDesktop()) {
      // На десктопе hidden запрещён — иначе любой hover умрёт
      ul.removeAttribute('hidden');
    } else {
      // На мобиле скрываем всё, что не открыто
      const item = ul.closest('.menu__item');
      if (!item.classList.contains('_hover')) ul.setAttribute('hidden', '');
    }
  });
}
mql.addEventListener('change', syncMode);
document.addEventListener('DOMContentLoaded', syncMode);

// Клики
document.addEventListener('click', (e) => {
  const t = e.target;

  if (isDesktop()) {
    const arrow = t.closest('.menu__arrow');
    if (arrow) {
      const item = arrow.closest('.menu__item_has-children');
      if (!item) return;
      // «Закрепляем» открытую вкладку (чтоб не закрывалась при покидании ховера)
      item.classList.toggle('_hover');
      // ВАЖНО: никаких hidden на десктопе
      const ul = item.querySelector('.menu__sub-list');
      if (ul) ul.removeAttribute('hidden');
      e.preventDefault();
    }
    // Клик вне пункта — снимаем «закрепление»
    if (!t.closest('.menu__item_has-children')) {
      document.querySelectorAll('.menu__item_has-children._hover')
        .forEach(li => li.classList.remove('_hover'));
    }
    return;
  }

  // Мобила: и кнопка, и стрелка переключают подпункт
  const trigger = t.closest('.menu__button, .menu__arrow');
  if (trigger) {
    const item = trigger.closest('.menu__item_has-children');
    const ul = item && item.querySelector('.menu__sub-list');
    if (!item || !ul) return;

    e.preventDefault();
    const next = !item.classList.contains('_hover');
    item.classList.toggle('_hover', next);

    // Управляем hidden и (если нужно) анимацией
    if (next) {
      ul.removeAttribute('hidden');
      slideToggle ? slideToggle(ul, true) : (ul.style.display = '');
    } else {
      slideToggle ? slideToggle(ul, false) : ul.setAttribute('hidden', '');
    }
  }
});
