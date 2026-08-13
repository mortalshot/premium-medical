import Swiper from "swiper"
import { Navigation } from "swiper/modules"

import "./slider.scss"

export function markSliderReady(slider, readySelectors = []) {
	slider.classList.add("_slider-ready")
	slider.closest("[data-fls-slider-wrapper]")?.classList.add("_slider-ready")
	readySelectors.forEach((selector) => {
		slider.closest(selector)?.classList.add("_slider-ready")
	})
}

export function ensureSlideVideoLoaded(video) {
	if (video.dataset.loaded === "true") return

	if (video.hasAttribute("data-fls-adaptive-video")) {
		video.setAttribute("data-fls-slider-video-active", "")
		video.dispatchEvent(new CustomEvent("fls-adaptive-video-load", {
			detail: {
				play: true,
			},
		}))
		return
	}

	let shouldLoad = false

	video.querySelectorAll("source[data-src]").forEach((source) => {
		source.src = source.dataset.src
		source.removeAttribute("data-src")
		shouldLoad = true
	})

	if (shouldLoad) video.load()

	video.dataset.loaded = "true"
}

export function updateSliderVideoState(swiper, shouldPlay = true) {
	const activeSlide = swiper.slides[swiper.activeIndex]

	swiper.slides.forEach((slide) => {
		slide.querySelectorAll("video").forEach((video) => {
			if (slide === activeSlide && shouldPlay) {
				video.setAttribute("data-fls-slider-video-active", "")
				ensureSlideVideoLoaded(video)
				if (!video.hasAttribute("data-fls-adaptive-video")) {
					video.play().catch(() => {})
				}
			} else {
				video.removeAttribute("data-fls-slider-video-active")
				video.pause()
				video.currentTime = 0
			}
		})
	})
}

export function initSlider(slider, options = {}, config = {}) {
	const {
		readySelectors = [],
		video = false,
		observeVisibility = false,
		visibilityRootSelector,
		visibilityThreshold = 0.2,
	} = config

	let isVisible = true
	const userOn = options.on || {}

	const swiper = new Swiper(slider, {
		...options,
		on: {
			...userOn,
			init(swiperInstance) {
				userOn.init?.(swiperInstance)
				if (video) updateSliderVideoState(swiperInstance, isVisible)
			},
			slideChangeTransitionEnd(swiperInstance) {
				userOn.slideChangeTransitionEnd?.(swiperInstance)
				if (video) updateSliderVideoState(swiperInstance, isVisible)
			},
			transitionEnd(swiperInstance) {
				userOn.transitionEnd?.(swiperInstance)
				if (video) updateSliderVideoState(swiperInstance, isVisible)
			},
			loopFix(swiperInstance) {
				userOn.loopFix?.(swiperInstance)
				if (video) updateSliderVideoState(swiperInstance, isVisible)
			},
		},
	})

	markSliderReady(slider, readySelectors)

	if (video && observeVisibility && "IntersectionObserver" in window) {
		const visibilityRoot = visibilityRootSelector ? slider.closest(visibilityRootSelector) : slider
		const sliderObserver = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting
				updateSliderVideoState(swiper, isVisible)
			},
			{ threshold: visibilityThreshold }
		)

		sliderObserver.observe(visibilityRoot || slider)
	}

	if (video) updateSliderVideoState(swiper, isVisible)

	return swiper
}

function initSliders() {
	document.querySelectorAll('[data-fls-slider=""]').forEach((slider) => {
		initSlider(slider, {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 800,
			navigation: {
				prevEl: slider.querySelector(".swiper-button-prev"),
				nextEl: slider.querySelector(".swiper-button-next"),
			},
		})
	})
}

if (document.querySelector("[data-fls-slider]")) {
	document.addEventListener("DOMContentLoaded", initSliders)
}
