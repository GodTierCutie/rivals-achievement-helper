import readline from "readline";
import { config, saveConfig } from "./config.js";
import { header,highlight, success } from "./ui.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => resolve(answer.trim()));
    });
}

function printMenu() {
    console.log("Current Settings:\n");

    console.log(
        `1) Mode: ${highlight(config.mode)}`
    );

    console.log(
        `2) Points Target: ${
            config.pointsTarget !== null
                ? highlight(config.pointsTarget.toString())
                : "Not Set"
        }`
    );

    console.log(
        `3) Tracker Path: ${config.trackerPath}`
    );

    console.log(
        `4) Colors: ${
            config.colors ? highlight("ON") : "OFF"
        }`
    );

    console.log("5) Reset Points Target");
    console.log("6) Exit\n");
}

async function showMenu() {
    header("Rivals Achievement Helper");
    printMenu();

    const choice = await ask("Select option: ");

    switch (choice) {
        case "1":
            await changeMode();
            break;

        case "2":
            await changePointsTarget();
            break;

        case "3":
            await changePath();
            break;

        case "4":
            toggleColors();
            break;

        case "5":
            resetPointsTarget();
            break;

        case "6":
            rl.close();
            return;

        default:
            console.log("Invalid choice.");
    }

    saveConfig();
    await showMenu();
}

async function changeMode() {
    console.log("\n1) Random");
    console.log("2) Weighted\n");

    const answer = await ask("Choice: ");

    config.mode = answer === "2" ? "weighted" : "random";

    success(`Mode set to ${config.mode}.\n`);
}

async function changePointsTarget() {
    const answer = await ask(
        "Enter points target (number): "
    );

    const num = parseInt(answer, 10);

    if (!isNaN(num) && num >= 0) {
        config.pointsTarget = num;
        success("Points target updated.\n");
    } else {
        console.log("Invalid number.\n");
    }
}

async function changePath() {
    const answer = await ask(
        "Enter tracker src path: "
    );

    if (answer !== "") {
        config.trackerPath = answer;
        success("Tracker path updated.\n");
    } else {
        console.log("Path not changed.\n");
    }
}

function toggleColors() {
    config.colors = !config.colors;
    console.log(
        `Colors are now ${config.colors ? "ON" : "OFF"}.\n`
    );
}

function resetPointsTarget() {
    config.pointsTarget = null;
    console.log("Points target reset.\n");
}

showMenu();