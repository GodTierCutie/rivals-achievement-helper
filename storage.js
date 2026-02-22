import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureFile(fileName, defaultData) {
    const fullPath = path.resolve(__dirname, fileName);

    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(
            fullPath,
            JSON.stringify(defaultData, null, 2)
        );
    }

    return JSON.parse(fs.readFileSync(fullPath));
}

function saveFile(fileName, data) {
    const fullPath = path.resolve(__dirname, fileName);

    fs.writeFileSync(
        fullPath,
        JSON.stringify(data, null, 2)
    );
}

export { ensureFile, saveFile };