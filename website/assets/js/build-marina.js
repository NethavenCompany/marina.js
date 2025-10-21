import { minifyFileContent, objectToArray } from "./util.js";
import { createFile } from "../marina/marina.esm.js";

const DEFAULT_TEMPLATE_OPTIONS = {
	filename: "marina.js",
	minify: false,
};

async function getFileTree() {
	const response = await fetch("assets/marina-tree.json");
	if (!response.ok) throw new Error("Could not load templates.json");
	return await response.json();
}

// Takes in the file tree and the form values (object with keys matching the filetree and booleans as values) and returns an a file tree only with the selected contents
function reduceTree(fileTree, chosenProps) {
	const chosenArray = objectToArray(chosenProps);
	const newTree = {};

	chosenArray.map(([key, chosen]) => {
		const fileTreeValue = fileTree[key];

		if (chosen && fileTreeValue) {
			newTree[key] = fileTreeValue;
		}
	});

	return fileTree;
}

export async function build(
	chosenTreeProps = {},
	options = DEFAULT_TEMPLATE_OPTIONS
) {
	const marinaFileTree = await getFileTree();
	const selectedContent = reduceTree(marinaFileTree, chosenTreeProps);
	let jsContent = objectToArray(selectedContent, "values")
		.map((item) => {
			if (typeof item === "string") return item;
			else return JSON.stringify(item);
		})
		.join(" ");

	if (options.minify) jsContent = minifyFileContent(jsContent);

	const finalBuild = createFile(jsContent, {
		name: options.filename,
		type: "text/javascript",
	});

	finalBuild.download();
	finalBuild.remove();
}
