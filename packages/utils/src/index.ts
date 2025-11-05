import { VERSION } from "./const";

import * as dom from "./dom/index";
import * as files from "./files/index";
import * as storage from "./storage/index";
import * as string from "./string/index";

const utils = {
    version: VERSION,
    ...dom,
    ...files,
    ...storage,
    ...string
}

export * from "./dom/index";
export * from "./files/index";
export * from "./storage/index";
export * from "./string/index";

export default utils;