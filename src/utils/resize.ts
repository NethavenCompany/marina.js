import { ASPECT_RATIOS } from "../const.js";

export function resizeToAspectRatio(
	element: HTMLElement,
	aspectRatio: keyof typeof ASPECT_RATIOS
) {
	const { maxWidth, maxHeight } = ASPECT_RATIOS[aspectRatio];

	const parent = element.parentElement;
	if (!parent) return;

	// Clear any previous transforms
	element.style.transform = "";

	// Calculate available space
	const parentWidth = parent.clientWidth - 40;
	const parentHeight = parent.clientHeight;

	// Calculate scale to fit within parent, but never exceed max dimensions
	const widthScale = Math.min(1, parentWidth / maxWidth);
	const heightScale = Math.min(1, parentHeight / maxHeight);
	const scale = Math.min(widthScale, heightScale);

	// Set container size and scale
	element.style.width = maxWidth + "px";
	element.style.height = maxHeight + "px";
	element.style.maxWidth = maxWidth + "px";
	element.style.maxHeight = maxHeight + "px";
	element.style.transformOrigin = "top left";
	element.style.transform = `scale(${scale})`;
}
