export function minifyCss(...css: string[]) {
	return (
		css
			.join(" ")
			// Remove comments 
			.replace(/\/\*[\s\S]*?\*\//g, "")
			// Remove unnecessary whitespace around selectors, properties, and values
			.replace(/\s*{\s*/g, "{")
			.replace(/;\s*/g, ";")
			.replace(/\s*}\s*/g, "}")
			.replace(/:\s*/g, ":")
			.replace(/,\s*/g, ",")
			// Remove multiple spaces and newlines, but preserve single spaces where needed
			.replace(/\s+/g, " ")
			.trim()
	);
}
