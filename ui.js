import { config } from "./config.js";
const useColors = config.colors;

// ANSI codes
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const MAGENTA = "\x1b[35m";
const RED = "\x1b[31m";
const GOLD = "\x1b[33m";
const SILVER = "\x1b[37m";
const BRONZE = "\x1b[38;5;166m";

function color(text, code) {
    if (!useColors) return text;
    return `${code}${text}${RESET}`;
}

function rarityColor(type, text) {
    if (!useColors) return text;

    switch (type) {
        case "gold":
            return `${GOLD}${text}${RESET}`;
        case "silver":
            return `${SILVER}${text}${RESET}`;
        case "bronze":
            return `${BRONZE}${text}${RESET}`;
        default:
            return text;
    }
}

function header(title) {
    const line = "═".repeat(60);
    console.log(color(`\n╔${line}╗`, CYAN));
    console.log(
        color(
            `║ ${title.padEnd(58)} ║`,
            CYAN
        )
    );
    console.log(color(`╚${line}╝\n`, CYAN));
}

function section(title) {
    console.log(color(`\n── ${title} ──\n`, MAGENTA));
}

function success(text) {
    console.log(color(text, GREEN));
}

function warning(text) {
    console.log(color(text, YELLOW));
}

function error(text) {
    console.log(color(text, RED));
}

function highlight(text) {
    return color(text, BOLD + CYAN);
}

export function unitsColor(text) {
    // 4aa7ff
    return `\x1b[38;2;74;167;255m${text}\x1b[0m`;
}

export {
    rarityColor,
    header,
    section,
    success,
    warning,
    error,
    highlight,
    color
};