import Swiper from 'swiper'

import 'swiper/css'
import '../../custom/adaptive-video/adaptive-video.js'
import './hero.scss'

function syncHeroVideos(swiper) {
	swiper.slides.forEach((slide, index) => {
		const video = slide.querySelector('.hero__video')

		if (!video) return

		if (index === swiper.activeIndex) {
			video.setAttribute('data-fls-slider-video-active', '')
			video.dispatchEvent(new CustomEvent('fls-adaptive-video-load', { detail: { play: true } }))
		} else {
			video.removeAttribute('data-fls-slider-video-active')
			video.pause()
			video.currentTime = 0
		}
	})
}

document.querySelectorAll('[data-hero-slider]').forEach((slider) => {
	new Swiper(slider, {
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 800,
		watchOverflow: true,
		on: {
			init: syncHeroVideos,
			slideChangeTransitionEnd: syncHeroVideos,
		},
	})
})
