import { build } from "./build-marina.js";
import marina, { createElement } from "../marina/marina.esm.js";

function getTreeInputs() {
	return {};
}

function getShouldMinify() {
	return false;
}

function getFilename() {
	return "marina.js";
}

function getStoredTheme() {
	const storedTheme = localStorage.getItem("marina-theme");
	if (storedTheme) {
		return storedTheme;
	}
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
}

function setTheme(newTheme) {
	const themes = ["light", "dark"];
	const root = document.querySelector(":root");

	for (const theme of themes) {
		root.classList.remove(theme);
	}

	root.classList.add(newTheme);
	localStorage.setItem("marina-theme", newTheme);
}

function switchTheme() {
	const nextTheme = document.querySelector(":root").classList.contains("light")
		? "dark"
		: "light";
	setTheme(nextTheme);
}

const PAGE_ELEMENTS = {
	hero: document.getElementById("hero"),
	getMarina: document.getElementById("get-marina"),
	radioIcon: document.querySelector(".radio-button-icon"),
	radioIconInner: document.querySelector(".radio-button-icon-inner"),
	themeSwitch: document.querySelector(".switch input"),
};

function createVersionTag() {
	const versionTag = createElement("span", {
		className: "marina-version-tag",
		innerHTML: `<code>v${marina.version}</code>`,
	});

	return versionTag;
}

function createMarinaBuildForm() {
	const title = createElement("h2", {
		innerText: "Get marina",
	});

	const aboutMarina = createElement("p", {
		innerHTML: `
		Marina is a library of tools, helpers, icons and components I've found to be handy over the years when im either forced to or it's just easier to use vanilla JS (so no React).
		It offers new custom HTML elements which are both accessible like normal HTML elements or through JavaScript.
		A few common example components are: <code>carousel</code>, <code>marina-icon</code>, <code>tabs</code> & much more!
		`.trim(),
	});

	const description = createElement("p", {
		innerText: `Marina is available in both IIFE (Immediately Invoked Function Expression) and ESM (Javascript Module) format.`,
	});

	const submitButton = createElement("button", {
		onclick: (e) => {
			e.preventDefault();

			const treeInputs = getTreeInputs();
			const config = { filename: getFilename(), minify: getShouldMinify() };

			build(treeInputs, config);
		},
		innerText: "Download marina.js",
		className: "btn -disabled",
	});

	const form = createElement("form", {}, [
		title,
		aboutMarina,
		description,
		submitButton,
	]);

	return form;
}

PAGE_ELEMENTS.hero.append(createVersionTag());
PAGE_ELEMENTS.getMarina.append(createMarinaBuildForm());
PAGE_ELEMENTS.themeSwitch.addEventListener("click", switchTheme);
PAGE_ELEMENTS.radioIcon.addEventListener("click", () => {
	PAGE_ELEMENTS.radioIconInner.classList.toggle("active");
});

const storedTheme = getStoredTheme();

setTheme(storedTheme);

PAGE_ELEMENTS.themeSwitch.checked = storedTheme === "light" ? false : true
