"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { useCopy } from "@/hooks/use-copy";
import { FONTS, type FontId, applyFont } from "@/lib/unicode";
import { CheckIcon, CopyIcon } from "./icons";
import styles from "./FontGallery.module.css";

const SAMPLE = "The quick brown fox 123";
const GALLERY_FONTS: readonly { id: FontId; label: string }[] = [
  { id: "normal", label: "Normal" },
  ...FONTS.map(({ id, label }) => ({ id, label })),
];

interface FontGalleryProps {
  text: string;
  onApply: (font: FontId) => void;
}

export const FontGallery = ({ text, onApply }: FontGalleryProps) => {
  const { copiedKey, copy } = useCopy();
  const source = useMemo(() => (text.trim() === "" ? SAMPLE : text), [text]);

  return (
    <section className={styles.section} aria-labelledby="fonts-title">
      <header className={styles.header}>
        <h2 id="fonts-title" className={styles.title}>
          All styles
        </h2>
        <p className={styles.sub}>Your whole text in every font. Copy it, or apply it to the editor.</p>
      </header>
      <ul className={styles.list}>
        {GALLERY_FONTS.map((font, i) => {
          const styled = applyFont(source, font.id);
          return (
            <motion.li
              key={font.id}
              className={styles.item}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className={styles.meta}>
                <span className={styles.label}>{font.label}</span>
                <div className={styles.actions}>
                  <button type="button" className={styles.action} onClick={() => onApply(font.id)}>
                    Apply
                  </button>
                  <button
                    type="button"
                    className={styles.action}
                    onClick={() => void copy(styled, font.id)}
                    aria-label={`Copy ${font.label}`}
                  >
                    {copiedKey === font.id ? <CheckIcon /> : <CopyIcon />}
                    {copiedKey === font.id ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <p className={styles.sample}>{styled}</p>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
};
