import Store from "./Store";

/**
 * Type for store event details with specific property types
 */
export interface StoreEventDetails {
	/** The store instance */
	store?: Store;
	/** Current products in the store */
	products?: Record<string, unknown>;
	/** Products that were removed */
	removedProducts?: Record<string, unknown>;
	/** Optional message associated with the event */
	message?: string;
	/** New products being set */
	newProducts?: Record<string, unknown>;
	/** Old products before being set */
	oldProducts?: Record<string, unknown>;
}

/**
 * Enumeration of all possible store events
 */
export enum StoreEvents {
	/** Triggered each time the store changes */
	Change = "change",
	/** Triggered each time the .set() method is called */
	Set = "set",
	/** Triggered each time the .remove() method is called */
	Remove = "remove",
	/** Triggered each time the .clear() method is called */
	Clear = "clear",
	/** Triggered when the store is deleted */
	Destroy = "destroy",
}

/**
 * Custom event class for store events with additional metadata
 */
export class StoreEvent<T extends StoreEventDetails> extends CustomEvent<T> {
	constructor(name: string, details: T) {
		super(name, {});

		// Copy all properties from details to the event instance
		for (const [key, value] of Object.entries(details)) {
			this[key as keyof this] = value as this[keyof this];
		}
	}
}
