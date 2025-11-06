import esbuild from "esbuild";
import fs from "fs-extra";
import path from "path";
import { optimize } from "svgo";

import {
	clearDistributables,
	configDefaults,
	distDescription,
	getPackagePaths,
} from "./utils.js";

const GLOBAL_CONFIG = {
	platform: "browser",
	bundle: true,
	resolveExtensions: [".ts", ".tsx", ".js"],
};

async function build() {
	await clearDistributables();

	await Promise.all([
		// The icons package is mainly svgs so needs a more specific build step.
		createIconsDist(),

		// everything else is typescript and the same structure so can use a similair build step.
		createDist("utils", { format: "esm" }),
		createDist("ui", { format: "esm" }),

		// Lastly we create the marina package, which is just the previous 3 packages combined into one.
		createDist("marina", { format: "esm", outfile: "marina.js" }),
		createDist("marina", {
			minify: true,
			format: "esm",
			outfile: "marina.min.js",
		}),
		createDist("marina", {
			format: "iife",
			outfile: "marina.global.js",
			globalName: "Marina",
		}),
		createDist("marina", {
			minify: true,
			format: "iife",
			outfile: "marina.global.min.js",
			globalName: "Marina",
		}),
	]);

	// copy marina to static assets.
	await fs.copy(getPackagePaths("marina").distDir, "website/assets/js/dist");
}

// ===============================
// File Builders
// ===============================

async function createDist(pkgName, config) {
	const { minify, format, outfile } = configDefaults(config);
	const pkg = getPackagePaths(pkgName, outfile);
	const description = distDescription(minify, format);
	const esbuildConfig = {
		...GLOBAL_CONFIG,
		...config,
		entryPoints: [pkg.indexFile],
		outfile: pkg.outfile,
	};

	console.log(
		`Creating ${description} for ${pkgName} - outfile: ${pkg.outfile}`
	);

	try {
		return await esbuild.build(esbuildConfig);
	} catch (error) {
		console.error(`Error creating ${description} for ${pkgName}:`, error);
		throw error;
	}
}

async function createIconsDist() {
	const pkg = getPackagePaths("icons");
	const svgsDir = path.join(pkg.rootDir, "svg");
	const distIconDir = path.join(pkg.distDir, "icons");

	await optimizeSvgs(svgsDir);

	await createDist("icons", { format: "esm" });

	// copy svgs to icon dir the dist
	await fs.copy(svgsDir, distIconDir);
	await fs.copy(distIconDir, "website/assets/js/dist/icons");
}

// ===============================
// Helper functions
// ===============================

async function optimizeSvgs(inputPath) {
	const stats = await fs.promises.stat(inputPath);
	const isDirectory = stats.isDirectory();
	const isFile = stats.isFile();
	const isSvg = inputPath.endsWith(".svg");

	if (isDirectory) {
		const entries = await fs.promises.readdir(inputPath);

		console.log(`Optimizing ${entries.length} SVGs in directory: ${inputPath}`);

		for (const entry of entries) {
			const fullEntryPath = path.join(inputPath, entry);
			await optimizeSvgs(fullEntryPath);
		}
	} else if (isFile && isSvg) {
		const content = await fs.promises.readFile(inputPath, "utf8");
		const result = optimize(content, {
			multipass: true,
			path: inputPath,
		});

		await fs.promises.writeFile(inputPath, result.data);
	}
}

// Build that shi
await build();
