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
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (ref.current && !ref.current.contains(target) && !target?.closest("[aria-haspopup='dialog']")) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
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
