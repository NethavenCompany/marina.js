import pkg from "../package.json";

export const VERSION = pkg.version;

export const CDN_BASE = (() => {
	if (
		location.href.includes("127.0.0.1") ||
		location.href.includes("localhost") ||
		location.href.includes("nethavencompany.github.io")
	) {
		return "./assets/js/dist/icons/";
	}

	return `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/svg/`;
})();

export const ICON_CACHE = new Map<string, string>();
