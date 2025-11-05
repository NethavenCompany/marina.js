export function join(...parts: string[]) {
	return parts
		.map((p) => p.replace(/^\/+|\/+$/g, "")) // trim slashes
		.filter(Boolean)
		.join("/");
}

export function dirname(p: string) {
	return p.replace(/\/[^/]*$/, "") || ".";
}

export function basename(p: string) {
	return p.split("/").pop();
}

export function extname(p: string) {
	const base = p.split("/").pop() || "";
	const i = base.lastIndexOf(".");
	return i > 0 ? base.slice(i) : "";
}
