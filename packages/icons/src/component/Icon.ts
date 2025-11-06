import { createElement, observe, minifyCss } from "@utils/index";
import { CDN_BASE } from "../const";
import { getIcon } from "./request";

export default class Icon extends HTMLElement {
	static assetsPath = CDN_BASE;
	private observer: MutationObserver | null = null;
	private name: string | null = null;
	private shadow: ShadowRoot | null = null;
	private styles = createElement("style", {
		innerHTML: minifyCss(`
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
        `),
	});
	private icon: string | null = null;

	constructor(name: string) {
		super();
		this.name = name;
		this.observer = this.#setupObserver();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		this.name = this.getAttribute("name") || "";
		this.icon = await getIcon(this.name);

		if (!this.shadow || !this.icon) return;

		this.setIcon(this.icon);
	}

	disconnectedCallback() {
		this.observer?.disconnect();
		this.styles.remove();
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
						this.icon = await getIcon(name);

						if (!this.icon) return;

						this.setIcon(this.icon);
					}
				});
			},
			{ attributes: true, childList: false, subtree: false }
		);
	}
}
