export function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function kebabize(string: string) {
	return string
		.trim()
		.replace(/[_\s]+/g, "-")
		.replace(/-+/g, "-")
		.toLowerCase();
}

export function snakeize(string: string) {
	return string
		.trim()
		.replace(/[-\s]+/g, "_")
		.replace(/_+/g, "_")
		.toLowerCase();
}

export function camelize(string: string) {
	return string
		.trim()
		.toLowerCase()
		.replace(/[-_\s]+(.)/g, (_, letter) => (letter ? letter.toUpperCase() : ""));
}

export function pascalize(string: string) {
	return string
		.trim()
		.toLowerCase()
		.replace(/(^\w|[-_\s]+(\w))/g, (_, g1, g2) => (g2 || g1).toUpperCase())
		.replace(/[-_\s]/g, "");
}

export function titilize(string: string) {
	return string
		.toLowerCase()
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
