import pkg from "../package.json";

import * as components from "./components/index.js";
import * as core from "./core/index.js";
import * as utils from "./utils/index.js";
import * as theme from "./theme/index.js";

console.log(`Marina v${pkg.version}`)

const Marina = {
	version: pkg.version,
	...components,
	...core,
	...utils,
	Themes: new theme.ThemeManager(),
};

export * from "./components/index.js";
export * from "./core/index.js";
export * from "./utils/index.js";

export default Marina;
