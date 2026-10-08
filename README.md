# TELESHΞN™ — Next-Generation Telegram Web Client

> Refactored, ultra-fast Telegram Web React client inspired by `evgeny-nadymov/telegram-react`, rewritten from the ground up for modern edge architectures and instant reactive performance.

![TELESHEN Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

## ⚡ Overview

**TELESHΞN™** is a complete architectural refactoring of the historic Telegram React client. All legacy dependencies and antiquated lifecycle modules have been replaced with a reactive, modular TypeScript system powered by React 19, Tailwind CSS, and Web Audio synthesizers.

Developed under **☬SHΞN™ Lab** by **SHΞЯVIN™** (`@shervinonx`).

---

## 🚀 Key Architectural Improvements

- **Modernized Reactive State Machine**: Replaced monolithic Redux/MTProto wrappers with zero-overhead optimistic hooks and local persistence.
- **Voice Message Audio Engine**: Live Web Audio API integration with multi-frequency waveforms, time calculation, and 1x / 1.5x / 2x speed toggles.
- **Bot & Automation Interface**: Built-in support for interactive bots (`TELESHΞN™ Assistant Bot`), custom inline keyboards, and command autocompletion (`/status`, `/deploy`, `/help`, `/theme`).
- **5 Custom Display Themes**:
  - `Midnight OLED` (pure #000000 black for OLED screens)
  - `Telegram Dark` (iconic classic Telegram deep blue)
  - `Emerald Green` (custom cyber-matrix palette)
  - `Cyber Violet` (high-contrast synthwave palette)
  - `Clean Light` (daylight high-contrast mode)
- **Zero-Pill Typography**: Strict compliance with professional frontend design standards.
- **End-to-End Encrypted Call Overlay**: Fullscreen voice call interface with 4-emoji visual cryptographic verification keys, visualizer ring, and controls.
- **Cloud Storage & Saved Messages**: Dedicated cloud space for snippets, code blocks, voice memos, and media.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 6+ / 8+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio**: Web Audio API Sound Synthesizer
- **Target Edge**: Cloudflare Workers / Pages & GitHub CI/CD

---

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation
```bash
git clone https://github.com/aishervin/teleshen.git
cd teleshen
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 📜 License & Credits

- Architectural foundation inspired by [evgeny-nadymov/telegram-react](https://github.com/evgeny-nadymov/telegram-react).
- Re-architected and maintained by **☬SHΞN™ Lab** (SHΞЯVIN™).
- Licensed under the Apache-2.0 License.
