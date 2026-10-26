# ⛪ ዳዊት ታይፕ (DawitType)
> **A Monkeytype-inspired Typing Platform for the Ethiopian Orthodox Psalms (መዝሙረ ዳዊት) in Amharic & English.**

---

## 🌟 Overview

**DawitType** brings the minimalist, fluid, and distraction-free typing mechanics of [Monkeytype](https://monkeytype.com) to the sacred scriptures of the **Ethiopian Orthodox Tewahedo Church Book of Psalms (መዝሙረ ዳዊት)**.

Practice typing all **151 canonical Psalms** chapter by chapter in authentic **Amharic (አማርኛ)** and **English (KJV / Classical)**, complete with interactive performance charts, mechanical keyboard and Ethiopian Begena sound synthesis, multiple Amharic keyboard mappings, and a 151-Psalm visual journey map.

---

## ✨ Features

- **📖 Complete 151 Canonical Psalms**: Includes Psalm 1 through 150 plus canonical **Psalm 151** (*"I was small among my brothers..." / "ከወንድሞቼ ይልቅ እኔ ትንሽ ነበርሁ..."*).
- **📅 7-Day Liturgical Reading Schedule (የሰባቱ ዕለታት የዳዊት ክፍፍል)**:
  - **ሰኞ (Monday)**: Psalms 1 – 30
  - **ማክሰኞ (Tuesday)**: Psalms 31 – 60
  - **ረቡዕ (Wednesday)**: Psalms 61 – 80
  - **ሐሙስ (Thursday)**: Psalms 81 – 110
  - **ዓርብ (Friday)**: Psalms 111 – 130
  - **ቅዳሜ (Saturday)**: Psalms 131 – 151
  - **እሑድ (Sunday)**: Canticles of the Prophets & Praises of St. Mary
- **⌨️ Amharic Keyboard Mappings**:
  - **PowerGe'ez (ፓወር ግዕዝ)**: Shift-based & phonetic input (`h`=ሀ, `H`=ሐ, `s`=ሰ, `S`=ሠ, `a`=አ, `A`=ዐ, `T`=ጠ, `C`=ጨ, `P`=ጰ, `Z`=ዠ).
  - **Keyman / SIL Unicode (ኪይማን)**: Multi-letter combinations (`sh`=ሸ, `ch`=ቸ, `ny`/`gn`=ኘ, `ts`=ጸ, `tz`=ፀ, `hh`=ሐ, `sz`=ሠ).
  - **Ethiopian Standard (ES 784:2001)**: Official Ethiopian national standard.
  - **Direct OS Keyboard**: Direct pass-through for system IME keyboards.
- **🎹 Interactive Virtual On-Screen Keyboard**:
  - Live visual keycaps showing primary and shift Fidels.
  - Dynamic 8-order vowel ribbon displaying real-time transformations (`1ኛ: e`, `2ኛ: u`, `3ኛ: i`, `4ኛ: a`, `5ኛ: E`, `6ኛ: alone`, `7ኛ: o`, `8ኛ: wa`).
- **🇬🇧 English Edition & Bilingual Support**:
  - Toggle between Amharic and English Psalm text with one click.
  - Complete English interface translation.
- **📊 Monkeytype Performance Analytics**:
  - Interactive SVG performance graph (WPM curve, Raw WPM, error markers).
  - Live HUD with Focus Mode (navigation dims while typing).
  - WPM, CPM, Accuracy %, and Consistency % tracking.
- **🔊 Web Audio API Sound Synthesizer**:
  - **Ethiopian Begena (በገና)**: Meditative acoustic harp pluck synthesis.
  - **Topre Thock**: Deep tactile mechanical switch sound.
  - **Cherry MX Blue**: Crisp mechanical click.
  - **Vintage Typewriter**: Metallic keystroke punch.
- **🎨 7 Sacred & Minimalist Themes**:
  - **ወርቀ ተዋሕዶ (Tewahedo Gold)**, **ብራና (Birana Parchment)**, **ላሊበላ (Lalibela Rock)**, **ካርቦን (Monkeytype Carbon)**, **አክሱም (Midnight Axum)**, **አባ ገርማ (Garima Gospels)**, **ሴሪካ (Serika Dark)**.
- **🗺️ 151 Psalms Spiritual Journey Map**:
  - 151-cell illuminated grid tracking completed chapters, high scores, and daily prayer streaks.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/JagemaK/Mezmur4.git
cd Mezmur4

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel
The repo ships a `vercel.json` (Vite preset, SPA rewrites, long-lived caching for hashed assets).
Import the repository at [vercel.com/new](https://vercel.com/new) and every push to the connected branch deploys automatically — or run `npx vercel --prod` locally.

---

## 🛠️ Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio**: Web Audio API (Native synthesized audio, 0 external assets)
- **Effects**: Canvas Confetti
- **Typography**: Google Fonts (Noto Sans Ethiopic, Noto Serif Ethiopic, JetBrains Mono)

---

## 📜 License
MIT License.
