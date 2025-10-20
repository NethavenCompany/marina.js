import { writeFileSync, readFileSync, readdirSync, statSync, unlinkSync } from "fs";
import { execSync } from "child_process";
import path from "path";

function removeComments(fileContent) {
    // Remove single-line comments (//...) and multi-line comments (/*...*/)
    return fileContent
        .replace(/\/\/.*(?=[\n\r])/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Recursively generates a JSON object representation for the given filepath.
 * Directories become objects. File values are their contents.
 * @param {string} inputPath - The path to the root file or directory.
 * @returns {object|string} - JSON object for directories, or file contents for files
 */
function generateFileTreeWithContents(inputPath) {
    const stats = statSync(inputPath);
    if (stats.isDirectory()) {
        const result = {};
        const entries = readdirSync(inputPath);
        for (const entry of entries) {
            const fullEntryPath = path.join(inputPath, entry);
            result[entry] = generateFileTreeWithContents(fullEntryPath);
        }
        return result;
    } else if (stats.isFile() && (inputPath.endsWith(".js") || inputPath.endsWith(".ts"))) {
        return removeComments(readFileSync(inputPath, 'utf8'));
    } else {
        return null;
    }
}

const rootDirPath = path.join(import.meta.dirname, "..")
const tempDistPath = path.join(rootDirPath, ".tempDist");

execSync(`tsc --outDir "${tempDistPath}"`, { stdio: "inherit" });

const marinaFileTree = generateFileTreeWithContents(tempDistPath);
const destinationPath = path.join(rootDirPath, "website", "assets", "marina-tree.json");

writeFileSync(destinationPath, JSON.stringify(marinaFileTree));

execSync(`rm -rf "${tempDistPath}"`, { stdio: "inherit" });
