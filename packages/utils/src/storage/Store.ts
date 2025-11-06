import { StoreEventDetails, StoreEvents, StoreEvent } from "./storage-events";

/**
 * Represents a subscription for an HTML element to sync with store data
 */
interface ElementSubscription {
	/** The HTML element to subscribe to */
	element: HTMLElement;
	/** The store product key to sync with */
	product: string;
	/** The DOM event type to listen for */
	event: keyof HTMLElementEventMap;
	/** The element attribute to sync with the store */
	attribute: string;
	/** The default value to set if the store product is not found */
	defaultValue?: unknown;
	cb?: (store: Store) => void;
}

export default class Store {
	public id: string;
	public products: Record<string, unknown>;
	public defaultProducts: Record<string, unknown>;
	public storage: Storage;
	private subscriptions = new Map<ElementSubscription, (event: Event) => void>();

	constructor(
		storeId: string,
		defaultProducts: Record<string, unknown> = {},
		storage: Storage
	) {
		this.id = storeId;
		this.products = defaultProducts;
		this.defaultProducts = defaultProducts;
		this.storage = storage;

		this.#prepare();
	}

	// Storage methods
	// ========================

	get = (product?: string): unknown => {
		if (product) {
			return this.products[product];
		}

		return this.products;
	};

	has = (product: string): boolean => {
		return product in this.products;
	};

	hasAll = (products: Record<string, unknown>): boolean => {
		return Object.keys(products).every((product) => this.has(product));
	};

	set = (products: Record<string, unknown>) => {
		const oldProducts = { ...this.products };
		const newProducts = { ...products };

		this.products = { ...this.products, ...products };
		this.#save();

		const result = {
			products: this.products,
			oldProducts,
			newProducts,
		};

		dispatchEvent(this.#event(StoreEvents.Set, result));

		return result;
	};

	remove = (...products: string[]) => {
		const oldProducts = { ...this.products };
		const removedProducts: Record<string, unknown> = {};

		products.forEach((product) => {
			removedProducts[product] = this.products[product];
			delete this.products[product];
		});

		this.#save();

		const result = {
			products: this.products,
			oldProducts,
			removedProducts,
		};

		dispatchEvent(this.#event(StoreEvents.Remove, result));

		return result;
	};

	clear = () => {
		const oldProducts = { ...this.products };

		this.products = {};
		this.#save();

		const result = {
			products: this.products,
			oldProducts,
		};

		dispatchEvent(this.#event(StoreEvents.Clear, result));

		return result;
	};

	destroy = () => {
		this.subscriptions.forEach((_listener, subscription) => {
			this.unsubscribeElement(subscription);
		});

		this.subscriptions.clear();

		this.storage.removeItem(this.id);

		const result = {
			products: this.products,
		};

		dispatchEvent(this.#event(StoreEvents.Destroy, result));

		return result;
	};

	// Event handling
	// ========================

	on = (
		event: StoreEvents,
		cb: (event: CustomEvent<StoreEventDetails>, store: Store) => void
	): void => {
		const eventId = `${this.id}__${event}`;
		addEventListener(eventId, (event: Event) => {
			cb(event as CustomEvent<StoreEventDetails>, this);
		});
	};

	subscribeElement = (subscription: ElementSubscription): void => {
		this.#repopulateSubscription(subscription);

		const listener = (event: Event) =>
			this.#handleSubscription(subscription, event);
		this.subscriptions.set(subscription, listener);

		subscription.element.addEventListener(subscription.event, listener);
	};

	unsubscribeElement = (subscription: ElementSubscription): void => {
		const listener = this.subscriptions.get(subscription);

		if (listener) {
			subscription.element.removeEventListener(subscription.event, listener);
			this.subscriptions.delete(subscription);
		}
	};

	// Protected methods
	// ========================

	#repopulateSubscription(subscription: ElementSubscription) {
		const storedItem = this.products[subscription.product];

		subscription.element.setAttribute(
			subscription.attribute,
			JSON.stringify(storedItem)
		);

		if (subscription.cb) subscription.cb(this);
	}

	#handleSubscription(subscription: ElementSubscription, event: Event): void {
		const target = event.target as unknown as Record<string, unknown>;
		const newProduct = target[subscription.attribute];

		const productSet: Record<string, unknown> = {};
		productSet[subscription.product] = newProduct;

		this.set(productSet);

		if (subscription.cb) subscription.cb(this);
	}

	#event(
		type: StoreEvents,
		details: StoreEventDetails = {}
	): StoreEvent<StoreEventDetails> {
		const eventId = `${this.id}__${type}`;
		return new StoreEvent<StoreEventDetails>(eventId, details);
	}

	#save(): void {
		this.storage.setItem(this.id, JSON.stringify(this.products));
	}

	#prepare(): void {
		const storedData = this.storage.getItem(this.id);

		if (storedData) {
			this.products = { ...this.products, ...JSON.parse(storedData) };
		}

		this.#save();
	}
}
