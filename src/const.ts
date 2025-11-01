import pkg from "../package.json";

export const VERSION = pkg.version;

export const ICON_CACHE = new Map<string, string>();

export const ASPECT_RATIOS = {
	A4: {
		maxWidth: 826,
		maxHeight: 1066,
	},
	A3: {
		maxWidth: 1166,
		maxHeight: 826,
	},
	A2: {
		maxWidth: 1166,
		maxHeight: 826,
	},
};