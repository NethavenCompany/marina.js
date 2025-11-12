import esbuild from "esbuild";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import kleur from "kleur";
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
	console.clear();

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
	const spinner = ora();
	const { minify, format, outfile } = configDefaults(config);
	const pkg = getPackagePaths(pkgName, outfile);
	const description = kleur.blue(distDescription(minify, format));
	const displayName = kleur.red(pkgName);
	const esbuildConfig = {
		...GLOBAL_CONFIG,
		...config,
		entryPoints: [pkg.indexFile],
		outfile: pkg.outfile,
	};

	spinner.start(
		`Creating ${description} of ${displayName} - outfile: ${pkg.outfile}`
	);

	try {
		const build = await esbuild.build(esbuildConfig);
		spinner.clear();
		spinner.succeed(`${description} of ${displayName} successfully created.`);
		return build;
	} catch (error) {
		spinner.fail(`Error creating ${description} of ${displayName}:`, error);
		return null;
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
	const spinner = ora();
	const stats = await fs.promises.stat(inputPath);
	const isDirectory = stats.isDirectory();
	const isFile = stats.isFile();
	const isSvg = inputPath.endsWith(".svg");

	if (isDirectory) {
		const entries = await fs.promises.readdir(inputPath);

		spinner.start(`Optimizing ${entries.length} SVGs in directory: ${inputPath}`);

		for (const entry of entries) {
			const fullEntryPath = path.join(inputPath, entry);
			await optimizeSvgs(fullEntryPath);
		}

		spinner.succeed(
			`${entries.length} SVGs optimized in directory: ${inputPath}`
		);
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
