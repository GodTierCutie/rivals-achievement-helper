import { ensureFile, saveFile } from "./storage.js";

const CONFIG_FILE = "config.json";

const DEFAULT_CONFIG = {
    mode: "random",
    pointsTarget: null,
    trackerPath: "../MRAchievements/src",
    colors: true
};

// Load once
let config = ensureFile(CONFIG_FILE, DEFAULT_CONFIG);

function saveConfig() {
    saveFile(CONFIG_FILE, config);
}

export { config, saveConfig };