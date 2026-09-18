"use client";

import { LayoutGroup, motion } from "motion/react";
import { useMemo } from "react";
import {
  SEE_MORE_CHARS,
  TARGETS,
  type TargetId,
  countChars,
  getUsage,
  readingSeconds,
  wordCount,
} from "@/lib/text";
import styles from "./LimitMeter.module.css";

const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const fmt = new Intl.NumberFormat("en-US");

interface LimitMeterProps {
  text: string;
  target: TargetId;
  onTargetChange: (target: TargetId) => void;
}

export const LimitMeter = ({ text, target, onTargetChange }: LimitMeterProps) => {
  const max = TARGETS.find((t) => t.id === target)?.max ?? 3000;
  const usage = useMemo(() => getUsage(text, max), [text, max]);
  const offset = CIRCUMFERENCE * (1 - Math.min(usage.ratio, 1));
  const words = wordCount(text);
  const seconds = readingSeconds(text);
  const chars = countChars(text);
  const hidden = Math.max(0, chars - SEE_MORE_CHARS.desktop);

  return (
    <div className={styles.meter} data-state={usage.state}>
      <LayoutGroup id="targets">
        <div className={styles.targets} role="radiogroup" aria-label="Limit for">
          {TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={t.id === target}
              className={styles.target}
              onClick={() => onTargetChange(t.id)}
            >
              {t.id === target && (
                <motion.span
                  layoutId="target-pill"
                  className={styles.pill}
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className={styles.targetLabel}>{t.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div className={styles.row}>
        <svg className={styles.ring} viewBox="0 0 36 36" aria-hidden="true">
          <circle className={styles.track} cx="18" cy="18" r={RADIUS} />
          <circle
            className={styles.progress}
            cx="18"
            cy="18"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.numbers}>
          <div className={`${styles.count} tabular`} aria-live="polite">
            {fmt.format(usage.count)}
            <span className={styles.max}> / {fmt.format(usage.max)}</span>
          </div>
          <div className={styles.status}>
            {usage.state === "over"
              ? `${fmt.format(-usage.remaining)} over the limit`
              : `${fmt.format(usage.remaining)} characters left`}
          </div>
        </div>
        <dl className={`${styles.stats} tabular`}>
          <div>
            <dt>Words</dt>
            <dd>{fmt.format(words)}</dd>
          </div>
          <div>
            <dt>Read</dt>
            <dd>{seconds < 60 ? `${seconds}s` : `${Math.ceil(seconds / 60)}m`}</dd>
          </div>
        </dl>
      </div>

      <p className={styles.hint}>
        {hidden > 0
          ? `${fmt.format(hidden)} characters sit behind “…see more” (≈${SEE_MORE_CHARS.desktop} desktop, ≈${SEE_MORE_CHARS.mobile} mobile). Make the hook count.`
          : `“…see more” appears after ≈${SEE_MORE_CHARS.desktop} characters on desktop, ≈${SEE_MORE_CHARS.mobile} on mobile.`}
      </p>
    </div>
  );
};
