import '@components/forms/input/input.js'
import '@components/forms/checkbox/checkbox.js'
import '@components/forms/select/select.js'
import './popup.js'

document.addEventListener('pointerdown', (event) => {
	const picker = event.target.closest('.appointment-popup__picker')
	const input = picker?.querySelector('input[data-fls-date-picker], input[data-fls-time-picker]')

	if (!input || input.disabled || input.readOnly || typeof input.showPicker !== 'function') return

	event.preventDefault()
	input.showPicker()
})
