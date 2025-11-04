type ElementAttributes = {
	[key: string]: any;
	dataset?: Record<string, string | boolean | number>;
	id?: string;
	className?: string;
};

/**
 * Create a DOM element with a simple attribute assignment helper.
 * Supports `dataset` and direct property assignment.
 * @param {string} tag
 * @param {Record<string, any>} attributes
 * @returns {HTMLElement}
 */
export function createElement(
	tag: string,
	attributes: ElementAttributes,
	children: (Node | string)[] = []
) {
	const element = document.createElement(tag);

	setAttributes(element, attributes);

	// Append the children to element
	for (const child of children) {
		element.append(child);
	}

	return element;
}

export function setAttributes(
	element: HTMLElement,
	attributes: ElementAttributes
) {
	for (const [key, value] of Object.entries(attributes)) {
		switch (key) {
			case "innerHTML": (element as any)[key] = value.trim();
				break;
			case "innerText": (element as any)[key] = value.trim();
				break;
			case "dataset":
				for (const [dataKey, dataValue] of Object.entries(value)) {
					element.dataset[dataKey] = dataValue as any;
				}
				break;
			default:
				(element as any)[key] = value;
				break;
		}
	}

	return element;
}


export function observe(element: HTMLElement, callback: MutationCallback, options?: MutationObserverInit) {
	const observer = new MutationObserver(callback);
	observer.observe(element, options);

	return observer;
};