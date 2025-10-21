var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// package.json
var package_default = {
  name: "@nethaven/marina",
  version: "1.0.0",
  description: "UI toolkit by Nethaven",
  keywords: [
    "ui",
    "ui toolkit",
    "javascript"
  ],
  homepage: "https://github.com/NethavenCompany/marina.js#readme",
  bugs: {
    url: "https://github.com/NethavenCompany/marina.js/issues"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/NethavenCompany/marina.js.git"
  },
  license: "ISC",
  author: "Nethaven",
  type: "module",
  main: "dist/marina.global.js",
  module: "dist/marina.esm.js",
  browser: "dist/marina.global.js",
  exports: {
    ".": {
      import: "./dist/marina.esm.js",
      require: "./dist/marina.global.js"
    }
  },
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
    typecheck: "tsc --noEmit",
    "generate:filetree-json": "node ./scripts/generate-filetree-json.js",
    "build:esbuild": "node ./scripts/esbuild.js",
    build: "npm run typecheck && npm run build:esbuild && npm run generate:filetree-json"
  },
  devDependencies: {
    esbuild: "^0.25.11"
  }
};

// src/components/index.ts
var components_exports = {};
__export(components_exports, {
  Carousel: () => Carousel_default,
  Modal: () => Modal_default,
  Select: () => Select_default,
  Tabs: () => Tabs_default,
  Tooltip: () => Tooltip_default
});

// src/core/Component.ts
var Component = class {
  constructor() {
    this.settings = null;
  }
  setSettings() {
  }
};
var Component_default = Component;

// src/components/Carousel.ts
var Carousel = class extends Component_default {
};
var Carousel_default = Carousel;

// src/components/Tabs.ts
var Tabs = class extends Component_default {
};
var Tabs_default = Tabs;

// src/components/Modal.ts
var Modal = class extends Component_default {
};
var Modal_default = Modal;

// src/components/Select.ts
var Select = class extends Component_default {
};
var Select_default = Select;

// src/components/Tooltip.ts
var Tooltip = class extends Component_default {
};
var Tooltip_default = Tooltip;

// src/core/index.ts
var core_exports = {};
__export(core_exports, {
  Component: () => Component_default,
  Icon: () => Icon_default,
  Plugin: () => BasePlugin_default
});

// src/core/Icon.ts
var Icon = class {
};
var Icon_default = Icon;

// src/core/BasePlugin.ts
var Plugin = class {
  constructor() {
  }
  install() {
  }
  enable() {
  }
  disable() {
  }
  uninstall() {
  }
};
var BasePlugin_default = Plugin;

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  createElement: () => createElement,
  createFile: () => createFile,
  setAttributes: () => setAttributes
});

// src/utils/dom.ts
function createElement(tag, attributes, children = []) {
  const element = document.createElement(tag);
  setAttributes(element, attributes);
  for (const child of children) {
    element.append(child);
  }
  return element;
}
function setAttributes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    switch (key) {
      case "innerHTML":
        element[key] = value.trim();
        break;
      case "innerText":
        element[key] = value.trim();
        break;
      case "dataset":
        for (const [dataKey, dataValue] of Object.entries(value)) {
          element.dataset[dataKey] = dataValue;
        }
        break;
      default:
        element[key] = value;
        break;
    }
  }
  return element;
}

// src/utils/files.ts
function createFile(content, props) {
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
      attached: false
    }
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
    remove
  };
}

// src/theme/ThemeManager.ts
var DEFAULT_THEME = {
  id: "mra-DefaultTheme"
};
var ThemeManager = class {
  #currentTheme;
  constructor() {
    this.#currentTheme = DEFAULT_THEME;
  }
  setCurrentTheme(themeId) {
    const theme = this.getTheme(themeId);
    this.#buildThemeCss(theme);
    this.#setRootClass(theme.id);
  }
  getCurrentTheme() {
    return this.#currentTheme;
  }
  getTheme(themeId) {
    return this.#localStorage.get(themeId);
  }
  modifyTheme(themeId, themeData) {
    const exisitingTheme = this.getTheme(themeId);
    const modifiedTheme = { ...exisitingTheme, ...themeData };
    this.#localStorage.set(themeId, modifiedTheme);
  }
  addTheme(theme) {
    if (this.getTheme(theme.id)) {
      throw new Error("");
    }
    this.#localStorage.set(theme.id, theme);
  }
  removeTheme(themeId) {
  }
  #buildThemeCss(theme) {
  }
  #destroyThemeCss(themeId) {
  }
  #setRootClass(themeId) {
  }
  get #localStorage() {
    return {
      set: (themeId, data) => {
        localStorage.setItem(themeId, JSON.stringify(data));
      },
      get: (themeId) => {
        const data = localStorage.getItem(themeId);
        if (!data) return null;
        return JSON.parse(data);
      }
    };
  }
};
var ThemeManager_default = ThemeManager;

// src/marina.ts
console.log(`Marina v${package_default.version}`);
var Marina = {
  version: package_default.version,
  ...components_exports,
  ...core_exports,
  ...utils_exports,
  theme: new ThemeManager_default()
};
var marina_default = Marina;

// src/index.ts
var index_default = marina_default;
export {
  Carousel_default as Carousel,
  Component_default as Component,
  Icon_default as Icon,
  Modal_default as Modal,
  BasePlugin_default as Plugin,
  Select_default as Select,
  Tabs_default as Tabs,
  Tooltip_default as Tooltip,
  createElement,
  createFile,
  index_default as default,
  setAttributes
};
