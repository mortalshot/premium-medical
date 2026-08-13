const videoSelector = "video[data-fls-adaptive-video]";
const loadedAttribute = "data-fls-adaptive-video-loaded";
const visibleAttribute = "data-fls-adaptive-video-visible";
const sliderActiveAttribute = "data-fls-slider-video-active";

function isVideoInSlider(video) {
	return Boolean(video.closest(".swiper-slide"));
}

function canLoadVideo(video) {
	return !isVideoInSlider(video) || video.hasAttribute(sliderActiveAttribute);
}

function getMatchedSource(video) {
	return [...video.querySelectorAll("source")].find((source) => {
		const media = source.getAttribute("media");
		return !media || window.matchMedia(media).matches;
	}) || null;
}

function getSourceSrc(source) {
	return source?.dataset.src || source?.getAttribute("src") || "";
}

function syncVideoPoster(video, source = getMatchedSource(video)) {
	const poster = source?.dataset.poster || video.dataset.poster || video.getAttribute("poster") || "";

	if (poster && video.getAttribute("poster") !== poster) {
		video.setAttribute("poster", poster);
	}
}

function syncVideoSources(video) {
	const matchedSource = getMatchedSource(video);
	const matchedSrc = getSourceSrc(matchedSource);
	let shouldLoad = false;

	if (!matchedSource || !matchedSrc) return false;

	video.querySelectorAll("source").forEach((source) => {
		const sourceSrc = getSourceSrc(source);

		if (source === matchedSource) {
			if (source.getAttribute("src") !== matchedSrc) {
				source.setAttribute("src", matchedSrc);
				shouldLoad = true;
			}
		} else if (source.dataset.src && source.hasAttribute("src")) {
			source.removeAttribute("src");
			shouldLoad = true;
		} else if (!source.dataset.src && sourceSrc && sourceSrc !== matchedSrc && source.hasAttribute("src")) {
			source.removeAttribute("src");
			shouldLoad = true;
		}
	});

	syncVideoPoster(video, matchedSource);
	return shouldLoad;
}

function playVideo(video) {
	if (!video.autoplay && !video.hasAttribute("data-fls-adaptive-video-play")) return;

	video.play().catch(() => {});
}

function loadAdaptiveVideo(video, forcePlay = false) {
	if (!canLoadVideo(video)) return;

	const shouldLoad = syncVideoSources(video);

	if (shouldLoad || !video.hasAttribute(loadedAttribute)) {
		video.load();
	}

	video.setAttribute(loadedAttribute, "");

	if (forcePlay || video.hasAttribute(visibleAttribute)) {
		playVideo(video);
	}
}

function handleMediaChange(video) {
	const wasLoaded = video.hasAttribute(loadedAttribute);
	const wasPlaying = !video.paused && !video.ended;
	const shouldLoad = syncVideoSources(video);

	if (wasLoaded && shouldLoad) {
		video.load();

		if (wasPlaying || video.hasAttribute(visibleAttribute)) {
			playVideo(video);
		}
	}
}

function observeVideo(video) {
	syncVideoPoster(video);

	if (!("IntersectionObserver" in window)) {
		video.setAttribute(visibleAttribute, "");
		loadAdaptiveVideo(video);
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				video.setAttribute(visibleAttribute, "");
				loadAdaptiveVideo(video);
			} else {
				video.removeAttribute(visibleAttribute);

				if (video.hasAttribute("data-fls-adaptive-video-pause")) {
					video.pause();
				}
			}
		});
	}, {
		rootMargin: "300px 0px",
		threshold: 0.01,
	});

	observer.observe(video);
}

function watchForcedLoad(video) {
	video.addEventListener("fls-adaptive-video-load", (event) => {
		loadAdaptiveVideo(video, Boolean(event.detail?.play));
	});
}

function watchSliderVideoState(video) {
	if (!isVideoInSlider(video) || !("MutationObserver" in window)) return;

	const observer = new MutationObserver(() => {
		if (video.hasAttribute(visibleAttribute)) {
			loadAdaptiveVideo(video);
		}
	});

	observer.observe(video, {
		attributes: true,
		attributeFilter: [sliderActiveAttribute],
	});
}

function watchVideoSources(video) {
	const mediaQueries = [
		...new Set(
			[...video.querySelectorAll("source[media]")]
				.map((source) => source.getAttribute("media"))
				.filter(Boolean)
		),
	];

	mediaQueries.forEach((media) => {
		const mediaQuery = window.matchMedia(media);
		const handleChange = () => handleMediaChange(video);

		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
		} else {
			mediaQuery.addListener(handleChange);
		}
	});
}

function initAdaptiveVideos() {
	document.querySelectorAll(videoSelector).forEach((video) => {
		observeVideo(video);
		watchForcedLoad(video);
		watchSliderVideoState(video);
		watchVideoSources(video);

		if (video.hasAttribute(sliderActiveAttribute)) {
			loadAdaptiveVideo(video, true);
		}
	});
}

document.addEventListener("DOMContentLoaded", initAdaptiveVideos);
