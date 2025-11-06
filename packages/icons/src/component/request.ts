import { path } from "@utils/index";
import Icon from "./Icon";

export function setAssetsPath(path: string) {
	Icon.assetsPath = path;
}

export async function getIcon(name: string) {
	const response = await fetch(path.join(Icon.assetsPath, `${name}.svg`));

	if (response.ok) {
		return await response.text();
	}

	return null;
}
