"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EMOJI_GROUPS, GLYPHS } from "@/lib/data/emoji";
import styles from "./EmojiPicker.module.css";

const TABS = [...EMOJI_GROUPS, { id: "glyphs", label: "Glyphs", emoji: GLYPHS }] as const;

interface EmojiPickerProps {
  open: boolean;
  onPick: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker = ({ open, onPick, onClose }: EmojiPickerProps) => {
  const [tab, setTab] = useState<string>(TABS[0].id);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // The root node is the shadow root when the editor runs inside the browser extension,
    // where events reaching `document` are retargeted to the shadow host.
    const root = ref.current?.getRootNode() ?? document;
    const onPointer = (e: Event) => {
      const path = e.composedPath();
      const onTrigger = path.some((node) => node instanceof Element && node.matches("[aria-haspopup='dialog']"));
      if (ref.current && !path.includes(ref.current) && !onTrigger) onClose();
    };
    const onKey = (e: Event) => e instanceof KeyboardEvent && e.key === "Escape" && onClose();
    root.addEventListener("pointerdown", onPointer);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("pointerdown", onPointer);
      root.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className={styles.picker}
          role="dialog"
          aria-label="Emoji and symbols"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={styles.tabs} role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === tab}
                className={styles.tab}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.grid}>
            {active.emoji.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={styles.emoji}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
