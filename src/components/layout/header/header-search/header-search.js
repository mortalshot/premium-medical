import './header-search.scss'

function setHeaderSearchOpen(isOpen) {
	const search = document.querySelector('[data-fls-header-search]')
	const triggers = document.querySelectorAll('[data-header-search-trigger]')
	const input = search?.querySelector('[data-header-search-input]')

	if (!search || !triggers.length) return

	search.classList.toggle('_header-search-open', isOpen)
	search.setAttribute('aria-hidden', String(!isOpen))
	search.toggleAttribute('inert', !isOpen)
	triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(isOpen)))
	document.dispatchEvent(new CustomEvent('header-search:toggle', { detail: { isOpen } }))

	if (isOpen && input) {
		window.requestAnimationFrame(() => input.focus())
	}
}

document.addEventListener('click', (event) => {
	if (event.target.closest('[data-header-search-trigger]')) {
		setHeaderSearchOpen(true)
		return
	}

	if (event.target.closest('[data-header-search-close]')) {
		setHeaderSearchOpen(false)
		return
	}

	const search = document.querySelector('[data-fls-header-search]')
	if (search?.classList.contains('_header-search-open') && !event.target.closest('[data-fls-header-search]')) {
		setHeaderSearchOpen(false)
	}
})

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') setHeaderSearchOpen(false)
})

document.addEventListener('header-mobile-menu:toggle', (event) => {
	if (event.detail.isOpen) setHeaderSearchOpen(false)
})
