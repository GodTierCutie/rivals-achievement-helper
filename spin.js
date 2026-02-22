import {
    getEligibleHeroes,
    getPendingAchievementsForHero,
    getHeroPointMap,
    getAllAchievements,
    isCompleted
} from "./achievementAdapter.js";

import {
    header,
    section,
    highlight,
    success,
    rarityColor,
    unitsColor
} from "./ui.js";

import { HEROIC_MILESTONES } from "./milestones.js";
import { HERO_MESSAGES } from "./heroMessages.js";
import { config } from "./config.js";

const appName = "Rivals Achievement Helper";

// -------------------------------
// Helpers
// -------------------------------

function progressBar(current, target, width = 26) {
    const percent = Math.min(current / target, 1);
    const filled = Math.round(percent * width);
    const empty = width - filled;

    return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${Math.floor(percent * 100)}%`;
}

// -------------------------------
// Hero Selection
// -------------------------------

const eligibleHeroes = getEligibleHeroes();

if (eligibleHeroes.length === 0) {
    console.log("No heroes with pending achievements.");
    process.exit(0);
}

function weightedRandomHero() {
    const pointMap = getHeroPointMap();
    const heroes = Object.keys(pointMap);

    const totalWeight = heroes.reduce(
        (sum, h) => sum + pointMap[h],
        0
    );

    let random = Math.random() * totalWeight;

    for (let hero of heroes) {
        if (random < pointMap[hero]) return hero;
        random -= pointMap[hero];
    }

    return heroes[0];
}

function pickHero() {
    if (config.mode === "weighted") {
        return weightedRandomHero();
    }

    return eligibleHeroes[
        Math.floor(Math.random() * eligibleHeroes.length)
    ];
}

// -------------------------------
// Spin Animation
// -------------------------------

header(appName);

let spins = 20;
const spinSpeed = 70;

const interval = setInterval(() => {

    const temp =
        eligibleHeroes[
            Math.floor(Math.random() * eligibleHeroes.length)
        ];

    process.stdout.write(
        "\rSpinning: " + highlight(temp) + "          "
    );

    spins--;

    if (spins <= 0) {

        clearInterval(interval);

        const final = pickHero();

        setTimeout(() => {

            process.stdout.write("\x1b[2J\x1b[0f");

            header(appName);
            header(`Selected Hero: ${final}`);

            const pending =
                getPendingAchievementsForHero(final);

            section("Pending Achievements");

            pending.forEach((a, i) => {

                const line = rarityColor(
                    a.type,
                    `${i + 1}. ${a.title} (${a.type} - ${a.points} pts)`
                );

                console.log(line);
                console.log(`   ${a.description}`);

                if (a.partner)
                    console.log(`   Partner: ${a.partner}`);

                if (a.target)
                    console.log(`   Target: ${a.target}`);

                if (a.hint)
                    console.log(`   Hint: ${a.hint}`);

                console.log("");
            });

            // ==================================================
            // STATISTICS (Compact Dashboard Style)
            // ==================================================

            section("Statistics");

            const allAchievements = getAllAchievements();

            const globalRemaining = allAchievements
                .filter(a => !isCompleted(a))
                .reduce((sum, a) => sum + a.points, 0);

            const allPoints = allAchievements
                .reduce((sum, a) => sum + a.points, 0);

            const earnedPoints = allPoints - globalRemaining;

            // --- Milestone Data ---

            const achievedMilestones =
                HEROIC_MILESTONES.filter(
                    m => earnedPoints >= m.points
                );

            const nextMilestone =
                HEROIC_MILESTONES.find(
                    m => earnedPoints < m.points
                );

            const unitsEarned = achievedMilestones
                .flatMap(m => m.rewards)
                .filter(r => r.type === "units")
                .reduce((sum, r) => sum + r.amount, 0);

            const unitsRemaining = HEROIC_MILESTONES
                .filter(m => earnedPoints < m.points)
                .flatMap(m => m.rewards)
                .filter(r => r.type === "units")
                .reduce((sum, r) => sum + r.amount, 0);

            // --- Core Stats ---

            console.log(`Points Earned: ${highlight(earnedPoints)}`);
            console.log(`Total Points Remaining: ${highlight(globalRemaining)}`);

            if (config.pointsTarget !== null) {
                const needed = Math.max(
                    0,
                    config.pointsTarget - earnedPoints
                );

                console.log(
                    `Points Needed To Reach Target (${config.pointsTarget}): ${highlight(needed)}`
                );
            }

            console.log(`Units Earned: ${unitsColor(unitsEarned)}`);
            console.log(`Units Remaining: ${unitsColor(unitsRemaining)}`);

            // ==================================================
            // NEXT MILESTONE
            // ==================================================

            section("Next Milestone");

            if (nextMilestone) {

                const pointsToNext =
                    nextMilestone.points - earnedPoints;

                console.log(`Milestone: ${nextMilestone.points} pts`);

                const rewardText = nextMilestone.rewards
                    .map(r => {
                        if (r.type === "units")
                            return unitsColor(`${r.amount} Units`);
                        if (r.type === "unstable_molecules")
                            return `${r.amount} Unstable Molecules`;
                        if (r.type === "chrono_tokens")
                            return `${r.amount} Chrono Tokens`;
                        if (r.type === "costume")
                            return r.name;
                        if (r.type === "title")
                            return r.name;
                        return "";
                    })
                    .join(", ");

                console.log(`Reward: ${rewardText}`);
                console.log(`Points Needed: ${highlight(pointsToNext)}`);
                console.log(progressBar(earnedPoints, nextMilestone.points));

            } else {

                console.log("All milestones completed.");
            }

            console.log("");

            const heroMessage = HERO_MESSAGES[final] ?? "Good Luck!";
            success(`✦ ${heroMessage}`);
            console.log("");

            process.exit(0);

        }, 700);
    }

}, spinSpeed);