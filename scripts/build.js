import esbuild from "esbuild";
import fs from "fs-extra";
import path from "path";
import { optimize } from "svgo";

const GLOBAL_CONFIG = {
	entryPoints: ["src/index.ts"],
	platform: "browser",
	bundle: true,
	resolveExtensions: [".ts", ".tsx", ".js"],
};

async function clearDistributables() {
	await fs.remove("dist");
	await fs.remove("website/assets/js/dist");
}

async function build() {
	await clearDistributables();
	
	await Promise.all([
		createMarina({ format: "esm", outfile: "dist/marina.js" }),
		createMarina({ format: "esm", outfile: "dist/marina.min.js", minify: true }),
		createMarina({ format: "iife", globalName: "Marina", outfile: "dist/marina.global.js" }),
		createMarina({ format: "iife", globalName: "Marina", outfile: "dist/marina.global.min.js", minify: true }),
	]);
	
	// await combineCssFiles("src/css");
	await optimizeSvgs("src/svg");

	await fs.copy("src/svg", "dist/icons");

	await fs.copy("dist", "website/assets/js/dist");
}

// ===============================
// File Builders
// ===============================

async function createMarina(config) {
	const { format, minify, outfile } = config;
	const description = `${minify ? "minified" : ""} ${format.toUpperCase()} build of Marina: ${outfile}`.trim();

	console.log(`Creating ${description}...`);

	try {
		return await esbuild.build({
			...GLOBAL_CONFIG,
			...config,
		});
	} catch (error) {
		console.error(`Error creating ${description}:`, error);
		throw error;
	}
}

// ===============================
// Helper functions
// ===============================

async function combineCssFiles(inputPath) {
	let result = "";
	const stats = await fs.promises.stat(inputPath);

	if (stats.isDirectory()) {
		const entries = await fs.promises.readdir(inputPath);
		for (const entry of entries) {
			const fullEntryPath = path.join(inputPath, entry);
			result += await combineCssFiles(fullEntryPath);
		}
	} else if (stats.isFile() && inputPath.endsWith(".css")) {
		result += await fs.promises.readFile(inputPath, "utf8");
	}

	return result;
}

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