import "./above.scss"

const above = document.querySelector('.above');
const footer = document.querySelector('footer');

let footerInView = false; // общий флаг

// 1) Следим за футером
const io = new IntersectionObserver((entries) => {
  footerInView = entries.some(e => e.isIntersecting);
  sync(); // пересчитать класс при каждом входе/выходе футера из вьюпорта
}, {
  threshold: 0,              // как только любой пиксель футера виден
  // rootMargin: '0px 0px -1px 0px' // опционально — скрывать чуть раньше
});
io.observe(footer);

// 2) Скролл (c rAF, чтобы не дёргать слишком часто)
let raf = false;
function onScroll() {
  if (!raf) {
    raf = true;
    requestAnimationFrame(() => { raf = false; sync(); });
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

function sync() {
  const pastFirstScreen = (window.scrollY || window.pageYOffset) >= window.innerHeight;

  // показываем только если перелистали 1 экран И футер не в зоне
  if (pastFirstScreen && !footerInView) {
    above.classList.add('_show');
  } else {
    above.classList.remove('_show');
  }
}

// начальная инициализация
sync();
