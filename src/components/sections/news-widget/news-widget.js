import Swiper from 'swiper'

import 'swiper/css'
import './news-widget.scss'

document.querySelectorAll('.news-widget__slide').forEach((slide) => {
	const link = document.createElement('a')
	link.className = 'news-widget__slide-link'
	link.href = '#'
	link.setAttribute('aria-label', slide.querySelector('.news-widget__slide-title')?.textContent?.trim() || 'Open news item')

	while (slide.firstChild) {
		link.append(slide.firstChild)
	}

	slide.append(link)
})

document.querySelectorAll('[data-news-widget-slider]').forEach((slider) => {
	const swiper = new Swiper(slider, {
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 600,
	})

	slider.querySelectorAll('[data-news-widget-prev]').forEach((button) => {
		button.addEventListener('click', () => swiper.slidePrev())
	})

	slider.querySelectorAll('[data-news-widget-next]').forEach((button) => {
		button.addEventListener('click', () => swiper.slideNext())
	})
})
