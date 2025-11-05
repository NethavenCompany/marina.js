import { MARINA_ICONS_PATH } from "../const";
import { createElement, observe } from "@utils/dom";
import { path } from "@utils/string"

export default class Icon extends HTMLElement {
	private static assetsPath = MARINA_ICONS_PATH;
	private observer: MutationObserver | null = null;
	private name: string | null = null;
	private shadow: ShadowRoot | null = null;
	private styles = createElement("style", {
		innerHTML: `
            :host {
                display: inline-block;
                width: auto;
                height: 1em;
                color: inherit;
            }

            :host svg {
                width: auto;
                height: inherit;
            }
        `,
	});
	private icon: string | null = null;

	constructor(name: string) {
		super();
		this.name = name;
		this.observer = this.#setupObserver();
		this.shadow = this.attachShadow({ mode: "closed" });
	}

	async connectedCallback() {
		this.name = this.getAttribute("name") || "";
		this.icon = await this.getIcon(this.name);

		if (!this.shadow || !this.icon) return;

		this.setIcon(this.icon);
	}

	disconnectedCallback() {
		this.observer?.disconnect();
	}

	static setAssetsPath(path: string) {
		Icon.assetsPath = path;
	}

	async getIcon(name: string) {
		const response = await fetch(path.join(Icon.assetsPath, `${name}.svg`));
		return await response.text();
	}

	async setIcon(icon: string) {
		if (!this.shadow || !icon) return;
		this.shadow.innerHTML = "";
		this.shadow.append(this.styles);
		this.shadow.innerHTML += icon;
	}

	#setupObserver(): MutationObserver {
		return observe(
			this,
			(mutations: MutationRecord[]) => {
				mutations.forEach(async (mutation) => {
					if (mutation.attributeName === "name") {
						const target = mutation.target as HTMLElement;
						const name = target.getAttribute("name");

						if (!name) return;

						this.name = name;
						this.setIcon(await this.getIcon(name));
					}
				});
			},
			{ attributes: true, childList: false, subtree: false }
		);
	}
}

export function setAssetsPath(path: string) {
	Icon.setAssetsPath(path);
}