import pkg from "../package.json";

export const VERSION = pkg.version;

export const MARINA_ICONS_PATH = "./assets/js/dist/icons/";
export const ICON_CACHE = new Map<string, string>();