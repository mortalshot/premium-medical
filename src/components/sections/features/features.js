import Swiper from 'swiper'

import 'swiper/css'
import './features.scss'

const mobileMedia = window.matchMedia('(max-width: 767.98px)')

document.querySelectorAll('[data-features-slider]').forEach((slider) => {
	let swiper = null

	const syncSlider = () => {
		if (mobileMedia.matches && !swiper) {
			swiper = new Swiper(slider, {
				slidesPerView: 1,
				spaceBetween: 16,
				speed: 600,
			})
		}

		if (!mobileMedia.matches && swiper) {
			swiper.destroy(true, true)
			swiper = null
		}
	}

	mobileMedia.addEventListener('change', syncSlider)
	syncSlider()
})
