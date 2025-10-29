import * as constants from "./const.js";
import * as components from "./components/index.js";
import * as core from "./core/index.js";
import * as utils from "./utils/index.js";

console.log(`Marina v${constants.VERSION}`);

const Marina = {
	version: constants.VERSION,
	...components,
	...utils,
	...core
};

export * from "./components/index.js";
export * from "./core/index.js";
export * from "./utils/index.js";

export default Marina;
