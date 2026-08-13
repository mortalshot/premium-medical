import 'intl-tel-input/styles-no-assets'
import flags1x from '@img/phone/flags.webp?url'
import flags2x from '@img/phone/flags@2x.webp?url'

document.documentElement.style.setProperty('--iti-path-flags-1x', `url("${flags1x}")`)
document.documentElement.style.setProperty('--iti-path-flags-2x', `url("${flags2x}")`)

async function initPhoneInputs() {
	const { default: intlTelInput } = await import('intl-tel-input/intlTelInputWithUtils')

	document.querySelectorAll('input[data-fls-input-phone]').forEach((input) => {
		if (input.dataset.flsInputPhoneInit !== undefined) return

		input.dataset.flsInputPhoneInit = ''

		const instance = intlTelInput(input, {
			initialCountry: input.dataset.flsInputPhoneCountry || 'lv',
			separateDialCode: true,
			nationalMode: false,
			strictMode: true,
			autoPlaceholder: 'aggressive',
			countrySearch: true,
		})

		input.addEventListener('blur', () => {
			const phoneNumber = instance.getNumber()

			if (phoneNumber) input.value = phoneNumber
		})
	})
}

if (document.querySelector('input[data-fls-input-phone]')) {
	window.addEventListener('load', () => {
		initPhoneInputs().catch((error) => {
			console.error('Unable to initialise phone input', error)
		})
	})
}
