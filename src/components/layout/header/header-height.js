let inited = false;
let lastH = -1;
let controller = null;
let ro = null;

export function initHeaderHeight() {
  if (inited) return;          // ← не даём инициализироваться повторно
  inited = true;

  const root = document.documentElement;
  const header = document.querySelector('.header');
  if (!header) return;

  const setVar = () => {
    // округлим, чтобы не дергать стиль при субпикселях
    const h = header.getBoundingClientRect().height || 0;
    if (h !== lastH) {
      lastH = h;
      root.style.setProperty('--header-height', `${h}px`);
    }
  };

  setVar();

  controller = new AbortController();
  const { signal } = controller;

  ro = new ResizeObserver(setVar);
  ro.observe(header);

  // на случай изменений без реального ресайза (зум, появление полосы прокрутки и т.п.)
  const onResize = () => requestAnimationFrame(setVar);
  window.addEventListener('resize', onResize, { passive: true, signal });
}

export function destroyHeaderHeight() {
  if (!inited) return;
  inited = false;
  if (ro) ro.disconnect();
  ro = null;
  if (controller) controller.abort(); // снимет все addEventListener с {signal}
  controller = null;
}
