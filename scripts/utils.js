import path from "path";
import fs from "fs-extra";

export const PACKAGE_NAMES = ["icons", "ui", "utils", "marina"];
export const PACKAGE_DIR = path.join(import.meta.dirname, "../packages");
export const ESBUILD_CONFIG_DEFAULTS = {
	minify: false,
	format: "esm",
	outfile: "index.js",
};

export function distDescription(minify, format) {
	return `${minify ? "minified" : ""} ${format.toUpperCase()} build`.trim();
}

export function configDefaults(config) {
	return { ...ESBUILD_CONFIG_DEFAULTS, ...config };
}

export function pkgPath(pkgName) {
	return path.join(PACKAGE_DIR, pkgName);
}
``;
export function getPackagePaths(pkgName, outfileName) {
	const rootDir = pkgPath(pkgName);
	const distDir = path.join(rootDir, "dist");
	const srcDir = path.join(rootDir, "src");
	const indexFile = path.join(srcDir, "index.ts");
	const outfile = path.join(distDir, outfileName || "index.js");

	return { rootDir, distDir, srcDir, indexFile, outfile };
}

export async function clearDistributables() {
	for (const key of PACKAGE_NAMES) {
		const paths = getPackagePaths(key);
		await fs.remove(paths.distDir);
	}
}
