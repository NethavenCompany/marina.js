import { VERSION } from "./const";
import Icon, { setAssetsPath } from "./component/Icon";

customElements.define("m-icon", Icon);

const icons = {
	version: VERSION,
	setAssetsPath,
};

export { setAssetsPath };

export default icons;
