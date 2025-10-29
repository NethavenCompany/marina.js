import Store from "../core/Store.js";

function useStoreMethods(store: Store) {
	return {
		id: store.id,
		products: store.products,
		get: store.get,
		has: store.has,
		hasAll: store.hasAll,
		set: store.set,
		remove: store.remove,
		clear: store.clear,
		destroy: store.destroy,
		on: store.on,
		subscribeElement: store.subscribeElement,
		unsubscribeElement: store.unsubscribeElement,
	};
}

/**
 * Creates a new SessionStore.
 * @param storeId The unique identifier for the store.
 */
export function useSessionStore(
	storeId: string,
	defaultProducts: Record<string, unknown> = {}
): ReturnType<typeof useStoreMethods> {
	const sessionStore = new Store(storeId, defaultProducts, sessionStorage);
	return useStoreMethods(sessionStore);
};

/**
 * Creates a new LocalStore.
 * @param storeId The unique identifier for the store.
 */
export function useLocalStore(
	storeId: string,
	defaultProducts: Record<string, unknown> = {}
): ReturnType<typeof useStoreMethods> {
	const localStore = new Store(storeId, defaultProducts, localStorage);
	return useStoreMethods(localStore);
};
