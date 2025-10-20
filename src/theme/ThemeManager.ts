import { createElement } from "../utils/dom.js";

type Theme = {
	id: string;
};

const DEFAULT_THEME = {
	id: "mra-DefaultTheme",
};

class ThemeManager {
	currentTheme?: Theme;

	constructor() {
		this.currentTheme = DEFAULT_THEME;
	}

	setCurrentTheme(themeId: string) {
		const theme = this.getTheme(themeId);
		this.#buildThemeCss(theme);
		this.#setRootClass(theme.id);
	}

	getTheme(themeId: string) {
		return this.#localStorage.get(themeId);
	}

	addTheme(theme: Theme) {
		this.#localStorage.set(theme.id, theme);
	}

	#buildThemeCss(theme: Theme) {}
	#destroyThemeCss(themeId: string) {}
	#setRootClass(themeId: string) {}

	get #localStorage() {
		return {
			set: (themeId: string, data: Theme) => {
				localStorage.setItem(themeId, JSON.stringify(data));
			},
			get: (themeId: string) => {
				const data = localStorage.getItem(themeId);
				if (!data) return null;
				return JSON.parse(data);
			},
		};
	}
}

export default ThemeManager;
