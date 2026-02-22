# 🎯 Rivals Achievement Helper

A lightweight CLI companion for **Marvel Rivals – Heroic Journey (in Achievements)** progression.

Rivals Achievement Helper reads your exported progress from the
[Marvel Rivals Achievements Tracker](https://github.com/MaJoRX0/MRAchievements) and helps you:

* 🎲 Pick a hero to grind
* 📋 View pending Heroic Journey achievements
* 📊 Track milestone progress
* 💎 Calculate units earned and remaining
* 🧠 Reduce decision fatigue

This tool focuses only on the **Heroic Journey** category.

## ❓ Why This Exists

Choosing which hero to grind next can be frustrating, especially when you're trying to:

* Reach your next milestone
* Maximize unit rewards
* Complete Heroic Journey efficiently

This tool gives you a clear direction based on your current progress — no overthinking required.

## 🧩 Requirements

* [Bun](https://bun.sh/)
* A local clone of the MRAchievements repository
* An exported progress file from the tracker

This project relies on Bun’s native support for importing TypeScript (`data.ts`) directly from the MRAchievements project.

Node.js is not supported without adding your own TypeScript runtime or build step.

## ⚙️ Setup

### 1️⃣ Clone MRAchievements

Clone the tracker repository locally:

```bash
git clone https://github.com/MaJoRX0/MRAchievements.git
```

You only need the repository locally — you do **not** need to run it.

### 2️⃣ Clone Rivals Achievement Helper

```bash
git clone https://github.com/GodTierCutie/rivals-achievement-helper.git
cd rivals-achievement-helper
```

### 3️⃣ Configure Tracker Path (If Needed)

By default, the tool expects MRAchievements to be located at:

```
../MRAchievements/src
```

If your folder structure is different, update `trackerPath` in `config.json`,
or use the interactive settings menu (see below).

Example:

```json
{
  "trackerPath": "C:/Projects/MRAchievements/src"
}
```

## 🚀 Usage

### Step 1 — Export Your Progress

From the MRAchievements tracker:

1. Click **Export**
2. Download `completed_achievements.json`
3. Place the file inside the Rivals Achievement Helper project directory

If multiple versions exist:

```
completed_achievements.json
completed_achievements (1).json
completed_achievements (2).json
```

The tool automatically selects the most recently modified file.

### Step 2 — Run the Spinner

```bash
bun spin.js
```

## 🛠 Settings (menu.js)

You can configure the tool directly from the terminal:

```bash
bun menu.js
```

The interactive menu allows you to change:

* 🎲 Selection mode (`random` or `weighted`)
* 🎯 Currency target
* 🎨 Color output (on/off)
* 📁 Tracker path

Changes are saved automatically to `config.json`.

No manual editing required (unless you prefer it).

## 📈 What It Shows

After running the spinner, the CLI displays:

* Selected hero
* Pending Heroic Journey achievements
* Total points remaining (hero + global)
* Points earned so far
* Milestone progress
* Units earned from milestones
* Units remaining from milestones
* Points needed to reach next milestone

## 📝 Notes

* This tool does **not** modify your tracker data.
* It reads progress from your exported file.
* Only the Heroic Journey category is considered.
* Designed primarily for personal use, but shared for anyone who finds it helpful.

## 🔮 Future Plans

* 🌐 Web version (GitHub Pages)
* 🧠 Smarter optimization modes
* 📊 Improved milestone visualization
* 🔗 Additional tracker integration

## 📌 Acknowledgment

This project was built with the help of **ChatGPT**, assisting with structuring logic, refining ideas, debugging, and iterating features along the way.

It started as a personal tool and gradually evolved into something worth sharing.

**Made with 🎯 focus by Mnae & ChatGPT**

## Credits

This project depends on the [Marvel Rivals Achievements Tracker](https://github.com/MaJoRX0/MRAchievements) by [MaJoR](https://github.com/MaJoRX0).
Full credit for the achievement data structure and tracking system belongs to the original author.