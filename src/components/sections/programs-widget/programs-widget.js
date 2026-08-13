import Swiper from 'swiper'

import 'swiper/css'
import './programs-widget.scss'

document.querySelectorAll('[data-programs-widget-slider]').forEach((slider) => {
	const swiper = new Swiper(slider, {
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: 600,
		rewind: true,
		grabCursor: true,
		breakpoints: {
			768: {
				spaceBetween: 32,
			},
		},
	})

	requestAnimationFrame(() => swiper.update())

	const widget = slider.closest('[data-fls-programs-widget]')

	widget.querySelector('[data-programs-widget-prev]').addEventListener('click', () => swiper.slidePrev())
	widget.querySelector('[data-programs-widget-next]').addEventListener('click', () => swiper.slideNext())
})
