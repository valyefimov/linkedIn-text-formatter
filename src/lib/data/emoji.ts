export interface EmojiGroup {
  id: string;
  label: string;
  emoji: readonly string[];
}

const split = (chars: string): string[] => Array.from(new Intl.Segmenter("en", { granularity: "grapheme" }).segment(chars), (s) => s.segment).filter((c) => c.trim() !== "");

export const EMOJI_GROUPS: readonly EmojiGroup[] = [
  { id: "popular", label: "Popular", emoji: split("🚀 💡 🔥 ✅ 👉 ✨ 🎯 📈 💬 🙌 👏 💪 🤝 🧠 ⚡ 🏆 ❤️ 👇 📌 🔑") },
  { id: "work", label: "Work", emoji: split("💼 📊 📅 📝 📣 🧩 🛠️ ⚙️ 💻 📱 🔒 🌐 📦 🧪 🔍 📚 🗂️ ⏱️ 💰 🏢") },
  { id: "faces", label: "Faces", emoji: split("😀 😄 😅 😂 🙂 😉 😍 🤔 😎 🥳 😮 😬 🙃 🤯 😴 🥲 😢 🙏 🤗 🫡") },
  { id: "symbols", label: "Symbols", emoji: split("✔️ ❌ ⚠️ ❓ ❗ ➕ ➖ ➡️ ⬆️ ⬇️ 🔴 🟢 🔵 ⭐ 🌟 💯 🆕 🔔 ♻️ ▶️") },
];

/** Compact bullet-like glyphs that LinkedIn renders on every device. */
export const GLYPHS: readonly string[] = split("• ◦ ▪ ▫ ● ○ ■ □ ▶ ► → ← ↑ ↓ ⇒ ✓ ✗ ★ ☆ ♦ │ ─ … ※");
