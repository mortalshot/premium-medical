import "./lazyload.scss"

const lazySelector = "img[data-fls-lazy][data-src]";
const loadedAttribute = "data-fls-lazy-loaded";

function setLazySource(element, dataKey, attrName) {
	const value = resolveLazySource(element.dataset[dataKey]);

	if (!value) return;

	element.setAttribute(attrName, value);
	element.removeAttribute(`data-${dataKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`);
}

function resolveLazySource(value) {
	if (!value) return "";

	return value
		.replace(/^\/src\/assets\//, "/assets/")
		.replace(/^src\/assets\//, "/assets/");
}

function loadLazyImage(image) {
	if (image.hasAttribute(loadedAttribute)) return;

	const picture = image.closest("picture");

	if (picture) {
		picture.querySelectorAll("source[data-srcset]").forEach((source) => {
			setLazySource(source, "srcset", "srcset");
		});
	}

	setLazySource(image, "srcset", "srcset");
	setLazySource(image, "src", "src");

	if (image.complete) {
		markLazyImageLoaded(image);
		return;
	}

	image.addEventListener("load", () => {
		markLazyImageLoaded(image);
	}, { once: true });

	image.addEventListener("error", () => {
		markLazyImageLoaded(image);
	}, { once: true });
}

function markLazyImageLoaded(image) {
	image.classList.add("_lazy-loaded");
	image.setAttribute(loadedAttribute, "");
}

function initLazyLoad() {
	const lazyImages = document.querySelectorAll(lazySelector);

	if (!lazyImages.length) return;

	if (!("IntersectionObserver" in window)) {
		lazyImages.forEach(loadLazyImage);
		return;
	}

	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;

			loadLazyImage(entry.target);
			observer.unobserve(entry.target);
		});
	}, {
		rootMargin: "300px 0px",
		threshold: 0.01,
	});

	const observeLazyImages = (scope) => {
		if (!scope) return;

		if (scope.matches?.(lazySelector) && !scope.hasAttribute(loadedAttribute)) {
			imageObserver.observe(scope);
		}

		scope.querySelectorAll?.(lazySelector).forEach((image) => {
			if (image.hasAttribute(loadedAttribute)) return;
			imageObserver.observe(image);
		});
	};

	observeLazyImages(document);

	const mutationObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (!(node instanceof HTMLElement)) return;
				observeLazyImages(node);
			});
		});
	});

	mutationObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

document.addEventListener("DOMContentLoaded", initLazyLoad);
