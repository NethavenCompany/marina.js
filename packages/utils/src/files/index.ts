import { createElement } from "../dom/elements";

type FileType =
	| "text/json"
	| "text/javascript"
	| "text/css"
	| "text/html"
	| "image/png"
	| "image/jpeg";

type FileProperties = {
	type: FileType;
	name: string;
};

export function createFile(content: string, props: FileProperties) {
	if (!props.name) {
		throw new Error('Missing property "name" is required');
	}

	if (!props.type) {
		throw new Error('Missing property "type" is required');
	}

	const file = new Blob([content], { type: props.type });
	const url = URL.createObjectURL(file);
	const downloadLink = createElement("a", {
		href: url,
		download: props.name,
		style: "display:none",
		dataset: {
			attached: false,
		},
	});

	const download = () => {
		if (downloadLink.dataset.attached === "false") {
			document.body.appendChild(downloadLink);
			downloadLink.dataset.attached = "true";
		}

		downloadLink.click();
	};

	const remove = () => {
		document.body.removeChild(downloadLink);
		URL.revokeObjectURL(url);
	};

	return {
		file,
		url,
		filename: props.name,
		filetype: props.type,
		download,
		remove,
	};
}
