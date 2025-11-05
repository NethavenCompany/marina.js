export function observe(element: HTMLElement, callback: MutationCallback, options?: MutationObserverInit) {
	const observer = new MutationObserver(callback);
	observer.observe(element, options);

	return observer;
};