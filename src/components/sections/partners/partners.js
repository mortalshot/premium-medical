import Swiper from 'swiper'

import 'swiper/css'
import './partners.scss'

document.querySelectorAll('[data-partners-slider]').forEach((slider) => {
	const swiper = new Swiper(slider, {
		slidesPerView: 'auto',
		spaceBetween: 24,
		speed: 600,
		grabCursor: true,
		breakpoints: {
			768: {
				spaceBetween: 40,
			},
		},
	})

	const section = slider.closest('[data-fls-partners]')

	section.querySelector('[data-partners-prev]').addEventListener('click', () => swiper.slidePrev())
	section.querySelector('[data-partners-next]').addEventListener('click', () => swiper.slideNext())
})
