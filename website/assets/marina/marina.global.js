"use strict";
var Marina = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Component: () => Component_default,
    createElement: () => createElement,
    createFile: () => createFile,
    default: () => index_default,
    hex: () => hex,
    hsl: () => hsl,
    lch: () => lch,
    minifyCss: () => minifyCss,
    oklch: () => oklch,
    resizeToAspectRatio: () => resizeToAspectRatio,
    rgb: () => rgb,
    rgba: () => rgba,
    setAttributes: () => setAttributes,
    useLocalStore: () => useLocalStore,
    useSessionStore: () => useSessionStore
  });

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
      build: "clear && npm run typecheck && npm run build:esbuild"
    },
    devDependencies: {
      esbuild: "^0.25.11",
      svgo: "^4.0.0"
    }
  };

  // src/const.ts
  var VERSION = package_default.version;
  var ASPECT_RATIOS = {
    A4: {
      maxWidth: 826,
      maxHeight: 1066
    },
    A3: {
      maxWidth: 1166,
      maxHeight: 826
    },
    A2: {
      maxWidth: 1166,
      maxHeight: 826
    }
  };

  // src/components/index.ts
  var components_exports = {};

  // src/core/index.ts
  var core_exports = {};
  __export(core_exports, {
    Component: () => Component_default
  });

  // src/core/Component.ts
  var Component = class extends HTMLElement {
    constructor() {
      super();
      this.settings = {};
      this.settings = {};
    }
  };
  var Component_default = Component;

  // src/utils/index.ts
  var utils_exports = {};
  __export(utils_exports, {
    createElement: () => createElement,
    createFile: () => createFile,
    hex: () => hex,
    hsl: () => hsl,
    lch: () => lch,
    minifyCss: () => minifyCss,
    oklch: () => oklch,
    resizeToAspectRatio: () => resizeToAspectRatio,
    rgb: () => rgb,
    rgba: () => rgba,
    setAttributes: () => setAttributes,
    useLocalStore: () => useLocalStore,
    useSessionStore: () => useSessionStore
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

  // src/utils/resize.ts
  function resizeToAspectRatio(element, aspectRatio) {
    const { maxWidth, maxHeight } = ASPECT_RATIOS[aspectRatio];
    const parent = element.parentElement;
    if (!parent) return;
    element.style.transform = "";
    const parentWidth = parent.clientWidth - 40;
    const parentHeight = parent.clientHeight;
    const widthScale = Math.min(1, parentWidth / maxWidth);
    const heightScale = Math.min(1, parentHeight / maxHeight);
    const scale = Math.min(widthScale, heightScale);
    element.style.width = maxWidth + "px";
    element.style.height = maxHeight + "px";
    element.style.maxWidth = maxWidth + "px";
    element.style.maxHeight = maxHeight + "px";
    element.style.transformOrigin = "top left";
    element.style.transform = `scale(${scale})`;
  }

  // src/utils/colors.ts
  function hex() {
  }
  function rgb() {
  }
  function rgba() {
  }
  function hsl() {
  }
  function lch() {
  }
  function oklch() {
  }

  // src/core/Store.ts
  var StoreEvent = class extends CustomEvent {
    constructor(name, details) {
      super(name, {});
      for (const [key, value] of Object.entries(details)) {
        this[key] = value;
      }
    }
  };
  var Store = class {
    constructor(storeId, defaultProducts = {}, storage) {
      this.subscriptions = /* @__PURE__ */ new Map();
      // Storage methods
      // ========================
      this.get = (product) => {
        if (product) {
          return this.products[product];
        }
        return this.products;
      };
      this.has = (product) => {
        return product in this.products;
      };
      this.hasAll = (products) => {
        return Object.keys(products).every((product) => this.has(product));
      };
      this.set = (products) => {
        const oldProducts = { ...this.products };
        const newProducts = { ...products };
        this.products = { ...this.products, ...products };
        this.#save();
        const result = {
          products: this.products,
          oldProducts,
          newProducts
        };
        dispatchEvent(this.#event("set" /* Set */, result));
        return result;
      };
      this.remove = (...products) => {
        const oldProducts = { ...this.products };
        const removedProducts = {};
        products.forEach((product) => {
          removedProducts[product] = this.products[product];
          delete this.products[product];
        });
        this.#save();
        const result = {
          products: this.products,
          oldProducts,
          removedProducts
        };
        dispatchEvent(this.#event("remove" /* Remove */, result));
        return result;
      };
      this.clear = () => {
        const oldProducts = { ...this.products };
        this.products = {};
        this.#save();
        const result = {
          products: this.products,
          oldProducts
        };
        dispatchEvent(this.#event("clear" /* Clear */, result));
        return result;
      };
      this.destroy = () => {
        this.subscriptions.forEach((_listener, subscription) => {
          this.unsubscribeElement(subscription);
        });
        this.subscriptions.clear();
        this.storage.removeItem(this.id);
        const result = {
          products: this.products
        };
        dispatchEvent(this.#event("destroy" /* Destroy */, result));
        return result;
      };
      // Event handling
      // ========================
      this.on = (event, cb) => {
        const eventId = `${this.id}__${event}`;
        addEventListener(eventId, (event2) => {
          cb(event2, this);
        });
      };
      this.subscribeElement = (subscription) => {
        this.#repopulateSubscription(subscription);
        const listener = (event) => this.#handleSubscription(subscription, event);
        this.subscriptions.set(subscription, listener);
        subscription.element.addEventListener(subscription.event, listener);
      };
      this.unsubscribeElement = (subscription) => {
        const listener = this.subscriptions.get(subscription);
        if (listener) {
          subscription.element.removeEventListener(subscription.event, listener);
          this.subscriptions.delete(subscription);
        }
      };
      this.id = storeId;
      this.products = defaultProducts;
      this.defaultProducts = defaultProducts;
      this.storage = storage;
      this.#prepare();
    }
    // Protected methods
    // ========================
    #repopulateSubscription(subscription) {
      const storedItem = this.products[subscription.product];
      subscription.element.setAttribute(
        subscription.attribute,
        JSON.stringify(storedItem)
      );
      if (subscription.cb) subscription.cb(this);
    }
    #handleSubscription(subscription, event) {
      const target = event.target;
      const newProduct = target[subscription.attribute];
      const productSet = {};
      productSet[subscription.product] = newProduct;
      this.set(productSet);
      if (subscription.cb) subscription.cb(this);
    }
    #event(type, details = {}) {
      const eventId = `${this.id}__${type}`;
      return new StoreEvent(eventId, details);
    }
    #save() {
      this.storage.setItem(this.id, JSON.stringify(this.products));
    }
    #prepare() {
      const storedData = this.storage.getItem(this.id);
      if (storedData) {
        this.products = { ...this.products, ...JSON.parse(storedData) };
      }
      this.#save();
    }
  };

  // src/utils/storage.ts
  function useStoreMethods(store) {
    return {
      id: store.id,
      products: store.products,
      get: store.get,
      has: store.has,
      hasAll: store.hasAll,
      set: store.set,
      remove: store.remove,
      clear: store.clear,
      destroy: store.destroy,
      on: store.on,
      subscribeElement: store.subscribeElement,
      unsubscribeElement: store.unsubscribeElement
    };
  }
  function useSessionStore(storeId, defaultProducts = {}) {
    const sessionStore = new Store(storeId, defaultProducts, sessionStorage);
    return useStoreMethods(sessionStore);
  }
  function useLocalStore(storeId, defaultProducts = {}) {
    const localStore = new Store(storeId, defaultProducts, localStorage);
    return useStoreMethods(localStore);
  }

  // src/utils/minify.ts
  function minifyCss(...css) {
    return css.join(" ").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*{\s*/g, "{").replace(/;\s*/g, ";").replace(/\s*}\s*/g, "}").replace(/:\s*/g, ":").replace(/,\s*/g, ",").replace(/\s+/g, " ").trim();
  }

  // src/marina.ts
  console.log(`Marina v${VERSION}`);
  var Marina = {
    version: VERSION,
    ...components_exports,
    ...utils_exports,
    ...core_exports
  };
  var marina_default = Marina;

  // src/index.ts
  var index_default = marina_default;
  return __toCommonJS(index_exports);
})();
