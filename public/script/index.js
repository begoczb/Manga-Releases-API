

function qs(selector, element = document) {
	return element.querySelector(selector)
}
function qsa(selector, element = document) {
	return [...element.querySelectorAll(selector)]
}
