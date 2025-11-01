import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { optimize } from "svgo";

const COPY_DEST = "website/assets/marina/"
const GLOBAL_CONFIG = {
	entryPoints: ["src/index.ts"],
	platform: "browser",
	bundle: true,
	resolveExtensions: [".ts", ".tsx", ".js"],
};

async function combineCssFiles(inputPath) {
	let result = "";
    const stats = await fs.promises.stat(inputPath);

    if (stats.isDirectory()) {
        const entries =  await fs.promises.readdir(inputPath);
        for (const entry of entries) {
            const fullEntryPath = path.join(inputPath, entry);
            result += await combineCssFiles(fullEntryPath);
        }
    } else if (stats.isFile() && (inputPath.endsWith(".css"))) {
        result += await fs.promises.readFile(inputPath, 'utf8');
    }

    return result;
}

async function optimizeSvgs(inputPath) {
    const stats = await fs.promises.stat(inputPath);
    if (stats.isDirectory()) {
        const entries = await fs.promises.readdir(inputPath);
        for (const entry of entries) {
            const fullEntryPath = path.join(inputPath, entry);
            await optimizeSvgs(fullEntryPath);
        }
    } else if (stats.isFile() && (inputPath.endsWith(".svg"))) {
		console.log(`Optimizing SVG: ${inputPath}`);
		const content = await fs.promises.readFile(inputPath, "utf8");
        const result = optimize(content, {
			multipass: true,
		});

        await fs.promises.writeFile(inputPath, result.data);
    }
}

await Promise.all([
	optimizeSvgs("src/svg"),
	// combineCssFiles("src/css")
	// 	.then((result) => fs.promises.writeFile("dist/marina.css", result))
	// 	.then(() => fs.promises.copyFile("dist/marina.css", COPY_DEST + "marina.css")),
]);

await Promise.all([
	// ESM build
	console.log("Building ESM build..."),
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "esm",
		outfile: "dist/marina.esm.js",
	}),
	// Minified ESM
	console.log("Building Minified ESM build..."),
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "esm",
		outfile: "dist/marina.esm.min.js",
		minify: true
	}),
	// IIFE build
	console.log("Building IIFE build..."),
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "iife",
		globalName: "Marina",
		outfile: "dist/marina.global.js",
	}),
	// Minified IIFE
	console.log("Building Minified IIFE build..."),
	esbuild.build({
		...GLOBAL_CONFIG,
		format: "iife",
		globalName: "Marina",
		outfile: "dist/marina.global.min.js",
		minify: true,
	}),
]);

// Copy over all builds to the landing page assets
console.log("Copying builds to landing page assets..."),
await Promise.all([
	fs.promises.copyFile("dist/marina.esm.js", COPY_DEST + "marina.esm.js"),
	fs.promises.copyFile("dist/marina.esm.min.js", COPY_DEST + "marina.esm.min.js"),
	fs.promises.copyFile("dist/marina.global.js", COPY_DEST + "marina.global.js"),
	fs.promises.copyFile("dist/marina.global.min.js", COPY_DEST + "marina.global.min.js"),
]);
