import "./sticky-sidebar.scss"

/*
  data-fls-sticky-sidebar="991.98, 24"
  data-fls-sticky-sidebar-content

  Optional:
  data-fls-sticky-sidebar-gap="24"
  data-fls-sticky-sidebar-offset-var="--header-height"
  data-fls-sticky-sidebar-boundary=".layout"
*/

const stickySidebarSelector = '[data-fls-sticky-sidebar]';
const stickySidebarContentSelector = '[data-fls-sticky-sidebar-content]';

const toNumber = (value, fallback = 0) => {
  const parsedValue = parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getParams = (value) => value.split(',').map((param) => param.trim()).filter(Boolean);

class StickySidebar {
  constructor(sidebar) {
    if (sidebar.stickySidebar) return;

    this.sidebar = sidebar;
    this.content = sidebar.querySelector(stickySidebarContentSelector) || sidebar.firstElementChild;
    this.params = getParams(sidebar.dataset.flsStickySidebar || '');
    this.boundary = sidebar.dataset.flsStickySidebarBoundary ?
      sidebar.closest(sidebar.dataset.flsStickySidebarBoundary) || document.querySelector(sidebar.dataset.flsStickySidebarBoundary) :
      sidebar.parentElement;
    this.breakpoint = toNumber(this.params[0], 991.98);
    this.gap = toNumber(this.params[1] || sidebar.dataset.flsStickySidebarGap, 24);
    this.offsetVar = sidebar.dataset.flsStickySidebarOffsetVar || '';
    this.media = window.matchMedia(`(min-width: ${this.breakpoint}px)`);
    this.resizeObserver = new ResizeObserver(() => this.requestUpdate());
    this.currentTop = null;
    this.lastScrollY = window.scrollY;
    this.isTicking = false;

    if (!this.content || !this.boundary) return;

    sidebar.stickySidebar = this;
    this.resizeObserver.observe(this.content);
    this.resizeObserver.observe(this.boundary);
    this.media.addEventListener('change', () => this.requestUpdate(true));
    window.addEventListener('resize', () => this.requestUpdate(true));
    window.addEventListener('load', () => this.requestUpdate(true));
    window.addEventListener('scroll', () => this.requestUpdate(), { passive: true });

    this.update(true);
  }

  getOffset() {
    if (!this.offsetVar) return 0;

    return toNumber(getComputedStyle(document.documentElement).getPropertyValue(this.offsetVar));
  }

  requestUpdate(force = false) {
    if (this.isTicking) return;

    this.isTicking = true;

    requestAnimationFrame(() => {
      this.update(force);
      this.isTicking = false;
    });
  }

  reset() {
    this.currentTop = null;
    this.sidebar.classList.remove('_sticky-sidebar-enabled', '_sticky-sidebar-fixed', '_sticky-sidebar-absolute');
    this.sidebar.style.removeProperty('--sticky-sidebar-gap');
    this.sidebar.style.removeProperty('--sticky-sidebar-offset');
    this.sidebar.style.removeProperty('--sticky-sidebar-height');
    this.content.style.removeProperty('position');
    this.content.style.removeProperty('top');
    this.content.style.removeProperty('left');
    this.content.style.removeProperty('width');
  }

  setAbsolute(top) {
    this.sidebar.classList.remove('_sticky-sidebar-fixed');
    this.sidebar.classList.add('_sticky-sidebar-absolute');
    this.content.style.position = 'absolute';
    this.content.style.top = `${top}px`;
    this.content.style.left = '0';
    this.content.style.width = '100%';
  }

  setFixed(top) {
    const sidebarRect = this.sidebar.getBoundingClientRect();

    this.sidebar.classList.remove('_sticky-sidebar-absolute');
    this.sidebar.classList.add('_sticky-sidebar-fixed');
    this.content.style.position = 'fixed';
    this.content.style.top = `${top}px`;
    this.content.style.left = `${sidebarRect.left}px`;
    this.content.style.width = `${sidebarRect.width}px`;
  }

  update(force = false) {
    if (!this.content || !this.boundary || !this.media.matches) {
      this.reset();
      return;
    }

    const scrollY = window.scrollY;
    const direction = scrollY > this.lastScrollY ? 'down' : 'up';
    const offset = this.getOffset();
    const contentHeight = this.content.offsetHeight;
    const boundaryRect = this.boundary.getBoundingClientRect();
    const boundaryTop = boundaryRect.top + scrollY;
    const boundaryHeight = this.boundary.offsetHeight;
    const boundaryBottom = boundaryTop + boundaryHeight;
    const sidebarRect = this.sidebar.getBoundingClientRect();
    const sidebarTop = sidebarRect.top + scrollY;
    const viewportTop = scrollY + offset + this.gap;
    const viewportBottom = scrollY + window.innerHeight - this.gap;
    const minTop = boundaryTop;
    const maxTop = Math.max(boundaryTop, boundaryBottom - contentHeight);

    this.sidebar.classList.add('_sticky-sidebar-enabled');
    this.sidebar.style.setProperty('--sticky-sidebar-gap', `${this.gap}px`);
    this.sidebar.style.setProperty('--sticky-sidebar-offset', `${offset}px`);
    this.sidebar.style.setProperty('--sticky-sidebar-height', `${contentHeight}px`);

    if (boundaryHeight <= contentHeight || sidebarRect.width <= 0) {
      this.setAbsolute(minTop - sidebarTop);
      this.lastScrollY = scrollY;
      return;
    }

    if (force || this.currentTop === null) {
      this.currentTop = clamp(sidebarRect.top + scrollY, minTop, maxTop);
    }

    if (contentHeight <= window.innerHeight - offset - this.gap * 2) {
      this.currentTop = clamp(viewportTop, minTop, maxTop);
    } else if (direction === 'down') {
      this.currentTop = Math.max(this.currentTop, viewportBottom - contentHeight);
    } else {
      this.currentTop = Math.min(this.currentTop, viewportTop);
    }

    this.currentTop = clamp(this.currentTop, minTop, maxTop);

    if (this.currentTop <= minTop || viewportTop <= minTop) {
      this.setAbsolute(minTop - sidebarTop);
    } else if (this.currentTop >= maxTop) {
      this.setAbsolute(maxTop - sidebarTop);
    } else {
      this.setFixed(this.currentTop - scrollY);
    }

    this.lastScrollY = scrollY;
  }
}

document.querySelector(stickySidebarSelector) ?
  document.querySelectorAll(stickySidebarSelector).forEach((sidebar) => new StickySidebar(sidebar)) : null;
