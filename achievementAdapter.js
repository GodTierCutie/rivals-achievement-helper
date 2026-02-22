import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------
// Resolve Tracker Path
// Priority: CLI flag → config → default
// -------------------------------

let trackerPath = config.trackerPath;

const cliArg = process.argv.find(arg =>
    arg.startsWith("--tracker=")
);

if (cliArg) {
    trackerPath = cliArg.split("=")[1];
}

const trackerFullPath = path.resolve(__dirname, trackerPath);

// -------------------------------
// Load Tracker Data
// -------------------------------

let initialCategories;

try {
    const dataModule = await import(
        path.join(trackerFullPath, "data.ts")
    );

    initialCategories = dataModule.initialCategories;
} catch (err) {
    console.error("Failed to load tracker data.ts");
    console.error("Checked path:", trackerFullPath);
    process.exit(1);
}

// -------------------------------
// Load Latest Export File
// -------------------------------

function findLatestExportFile() {
    const files = fs.readdirSync(__dirname);

    const matches = files.filter(f =>
        f.startsWith("completed_achievements") &&
        f.endsWith(".json")
    );

    if (matches.length === 0) return null;

    return matches
        .map(file => ({
            file,
            time: fs.statSync(
                path.join(__dirname, file)
            ).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)[0].file;
}

const latestExportFile = findLatestExportFile();
let completedSet = new Set();

if (latestExportFile) {
    const raw = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, latestExportFile)
        )
    );

    Object.values(raw).forEach(idArray => {
        idArray.forEach(id => completedSet.add(id));
    });

    console.log(
        `Using progress file: ${latestExportFile}\n`
    );
} else {
    console.warn(
        "No completed_achievements file found.\n" +
        "Export your progress from the tracker."
    );
}

// -------------------------------
// Achievement Helpers
// -------------------------------

function getAllAchievements() {
    const heroicCategory = initialCategories.find(
        c => c.id === "heroic-journey"
    );

    if (!heroicCategory) {
        console.error("heroic-journey category not found.");
        process.exit(1);
    }

    return heroicCategory.achievements ?? [];
}

function isCompleted(achievement) {
    return completedSet.has(achievement.id);
}

function getPendingAchievementsForHero(heroName) {
    return getAllAchievements().filter(a =>
        a.hero === heroName && !isCompleted(a)
    );
}

function getEligibleHeroes() {
    const heroSet = new Set();

    getAllAchievements().forEach(a => {
        if (a.hero && !isCompleted(a)) {
            heroSet.add(a.hero);
        }
    });

    return [...heroSet];
}

function getHeroPointMap() {
    const map = {};

    getAllAchievements().forEach(a => {
        if (a.hero && !isCompleted(a)) {
            map[a.hero] = (map[a.hero] || 0) + a.points;
        }
    });

    return map;
}

export {
    getAllAchievements,
    getEligibleHeroes,
    getPendingAchievementsForHero,
    getHeroPointMap,
    isCompleted
};