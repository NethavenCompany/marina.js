import esbuild from "esbuild";
import fs from "fs";

const GLOBAL_CONFIG = {
	entryPoints: ["src/index.ts"],
	platform: "browser",
	bundle: true,
	resolveExtensions: [".ts", ".tsx", ".js"],
};

await Promise.all([
	// ESM build
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "esm",
		outfile: "dist/marina.esm.js",
	}),
	// Minified ESM
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "esm",
		outfile: "dist/marina.esm.min.js",
		minify: true
	}),
	// IIFE build
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "iife",
		globalName: "Marina",
		outfile: "dist/marina.global.js",
	}),
	// Minified IIFE
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "iife",
		globalName: "Marina",
		outfile: "dist/marina.global.min.js",
		minify: true,
	}),
]);

const copyDestDir = "website/assets/marina/"

// Copy over all builds to the landing page assets
await Promise.all([
	fs.promises.copyFile("dist/marina.esm.js", copyDestDir + "marina.esm.js"),
	fs.promises.copyFile("dist/marina.esm.min.js", copyDestDir + "marina.esm.min.js"),
	fs.promises.copyFile("dist/marina.global.js", copyDestDir + "marina.global.js"),
	fs.promises.copyFile("dist/marina.global.min.js", copyDestDir + "marina.global.min.js"),
]);
