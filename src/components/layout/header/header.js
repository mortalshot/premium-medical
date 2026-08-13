import './header.scss'
import './header-search/header-search.js'
import { bodyLock, bodyUnlock } from '@js/common/functions.js'

const smallPCMedia = window.matchMedia('(max-width: 89.99875em)')

function revealInitiallyHiddenHeaderElements() {
	document.querySelectorAll('[data-header-initially-hidden]').forEach((element) => {
		element.style.removeProperty('display')
	})
}

function setHeaderServicesOpen(isOpen) {
	const header = document.querySelector('[data-fls-header]')
	const trigger = document.querySelector('[data-header-services-trigger]')
	const menu = document.querySelector('[data-header-services-menu]')

	if (!header || !trigger || !menu) return

	header.classList.toggle('_header-services-open', isOpen)
	trigger.classList.toggle('header__menu-link--active', isOpen)
	trigger.setAttribute('aria-expanded', String(isOpen))
	menu.classList.toggle('_mega-menu-open', isOpen)
	menu.setAttribute('aria-hidden', String(!isOpen))
}

function setHeaderAboutOpen(isOpen) {
	const header = document.querySelector('[data-fls-header]')
	const trigger = document.querySelector('[data-header-about-trigger]')
	const menu = document.querySelector('[data-header-about-menu]')

	if (!header || !trigger || !menu) return

	header.classList.toggle('_header-about-open', isOpen)
	trigger.classList.toggle('header__menu-link--active', isOpen)
	trigger.setAttribute('aria-expanded', String(isOpen))
	menu.classList.toggle('_header-about-menu-open', isOpen)
	menu.setAttribute('aria-hidden', String(!isOpen))
}

function setHeaderMobileMenuOpen(isOpen) {
	const header = document.querySelector('[data-fls-header]')
	const trigger = document.querySelector('[data-header-mobile-menu-trigger]')
	const menu = header?.querySelector('.header__bottom')

	if (!header || !trigger || !menu || header.classList.contains('_header-mobile-menu-open') === isOpen) return

	header.classList.toggle('_header-mobile-menu-open', isOpen)
	menu.setAttribute('aria-hidden', String(!isOpen))
	menu.toggleAttribute('inert', !isOpen)
	trigger.setAttribute('aria-expanded', String(isOpen))
	document.dispatchEvent(new CustomEvent('header-mobile-menu:toggle', { detail: { isOpen } }))

	if (isOpen) {
		bodyLock(0)
	} else {
		setHeaderServicesOpen(false)
		setHeaderAboutOpen(false)
		bodyUnlock(0)
	}
}

function headerDropdownInit(itemSelector, triggerSelector, menuSelector, activeClass, menuActiveClass) {
	const item = document.querySelector(itemSelector)
	const trigger = document.querySelector(triggerSelector)
	const menu = document.querySelector(menuSelector)

	if (!item || !trigger || !menu) return

	let closeTimer

	const setOpen = (isOpen) => {
		menu.classList.toggle(menuActiveClass, isOpen)
		trigger.classList.toggle(activeClass, isOpen)
		trigger.setAttribute('aria-expanded', String(isOpen))
		menu.setAttribute('aria-hidden', String(!isOpen))
	}

	const openMenu = () => {
		if (smallPCMedia.matches) return

		if (document.querySelector('[data-fls-header-search]')?.classList.contains('_header-search-open')) return

		window.clearTimeout(closeTimer)
		setOpen(true)
	}

	const closeMenu = () => {
		if (smallPCMedia.matches) return

		window.clearTimeout(closeTimer)
		closeTimer = window.setTimeout(() => setOpen(false), 120)
	}

	item.addEventListener('pointerenter', openMenu)
	item.addEventListener('pointerleave', closeMenu)

	if (!item.contains(menu)) {
		menu.addEventListener('pointerenter', openMenu)
		menu.addEventListener('pointerleave', closeMenu)
	}

	document.addEventListener('header-search:toggle', (event) => {
		if (event.detail.isOpen) setOpen(false)
	})
}

headerDropdownInit('[data-header-services]', '[data-header-services-trigger]', '[data-header-services-menu]', 'header__menu-link--active', '_mega-menu-open')
headerDropdownInit('[data-header-about]', '[data-header-about-trigger]', '[data-header-about-menu]', 'header__menu-link--active', '_header-about-menu-open')
revealInitiallyHiddenHeaderElements()

document.addEventListener('click', (event) => {
	const mobileMenuTrigger = event.target.closest('[data-header-mobile-menu-trigger]')
	const servicesTrigger = event.target.closest('[data-header-services-trigger]')
	const servicesClose = event.target.closest('[data-header-services-close]')
	const aboutTrigger = event.target.closest('[data-header-about-trigger]')
	const aboutClose = event.target.closest('[data-header-about-close]')

	if (mobileMenuTrigger) {
		const header = document.querySelector('[data-fls-header]')
		setHeaderMobileMenuOpen(!header?.classList.contains('_header-mobile-menu-open'))
		return
	}

	if (servicesClose) {
		setHeaderServicesOpen(false)
		return
	}

	if (aboutClose) {
		setHeaderAboutOpen(false)
		return
	}

	if (!smallPCMedia.matches) return

	const header = document.querySelector('[data-fls-header]')

	if (servicesTrigger) {
		setHeaderServicesOpen(!header?.classList.contains('_header-services-open'))
	}

	if (aboutTrigger) {
		setHeaderAboutOpen(!header?.classList.contains('_header-about-open'))
	}
})

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') setHeaderMobileMenuOpen(false)
})

document.addEventListener('header-search:toggle', (event) => {
	if (event.detail.isOpen) setHeaderMobileMenuOpen(false)
})

smallPCMedia.addEventListener('change', (event) => {
	if (!event.matches) {
		setHeaderServicesOpen(false)
		setHeaderAboutOpen(false)
		setHeaderMobileMenuOpen(false)
	}
})
