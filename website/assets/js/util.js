export function objectToArray(object, returns = "entries") {
	return Array.from(Object[returns](object));
}

export function minifyFileContent(fileContent) {
	return fileContent;
}
