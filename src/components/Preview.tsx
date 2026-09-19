"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { type Device, foldText, linkify } from "@/lib/text";
import { DesktopIcon, MobileIcon } from "./icons";
import styles from "./Preview.module.css";

interface Profile {
  name: string;
  headline: string;
}

const DEFAULT_PROFILE: Profile = { name: "Your Name", headline: "Your headline · Open to ideas" };
const PLACEHOLDER = "Start writing and your post will appear here…";

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => Array.from(w)[0]?.toUpperCase())
    .join("") || "?";

const Body = ({ text }: { text: string }) => (
  <>
    {linkify(text).map((segment, i) =>
      segment.kind === "text" ? (
        <span key={i}>{segment.text}</span>
      ) : (
        <span key={i} className={styles.link}>
          {segment.text}
        </span>
      ),
    )}
  </>
);

interface PreviewProps {
  text: string;
  device: Device;
  onDeviceChange: (device: Device) => void;
}

export const Preview = ({ text, device, onDeviceChange }: PreviewProps) => {
  const [profile, setProfile] = usePersistentState<Profile>("ltf:profile", DEFAULT_PROFILE);
  const [expanded, setExpanded] = useState(false);
  const fold = foldText(text, device);
  const showAll = expanded || !fold.truncated;

  return (
    <section className={styles.wrap} aria-label="Post preview">
      <header className={styles.header}>
        <h2 className={styles.title}>Preview</h2>
        <div className={styles.devices} role="radiogroup" aria-label="Device">
          {(["mobile", "desktop"] as const).map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={device === d}
              aria-label={d}
              className={styles.device}
              onClick={() => {
                onDeviceChange(d);
                setExpanded(false);
              }}
            >
              {d === "mobile" ? <MobileIcon /> : <DesktopIcon />}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.stage}>
        <motion.article
          className={styles.card}
          animate={{ width: device === "mobile" ? 375 : 555 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <div className={styles.author}>
            <div className={styles.avatar} aria-hidden="true">
              {initials(profile.name)}
            </div>
            <div className={styles.who}>
              <input
                className={styles.name}
                aria-label="Preview name"
                value={profile.name}
                maxLength={60}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <input
                className={styles.headline}
                aria-label="Preview headline"
                value={profile.headline}
                maxLength={120}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              />
              <span className={styles.meta}>Now · 🌐</span>
            </div>
          </div>

          <motion.div layout="position" className={styles.body}>
            {text.trim() === "" ? (
              <p className={styles.placeholder}>{PLACEHOLDER}</p>
            ) : (
              <p className={styles.text}>
                <Body text={showAll ? text : fold.visible} />
                {!showAll && (
                  <>
                    {" "}
                    <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
                      …more
                    </button>
                  </>
                )}
              </p>
            )}
            <AnimatePresence>
              {expanded && fold.truncated && (
                <motion.button
                  type="button"
                  className={styles.less}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExpanded(false)}
                >
                  Show less
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <div className={styles.counts}>
            <span>👍❤️ 57</span>
            <span>24 comments · 6 reposts</span>
          </div>
          <div className={styles.actions} aria-hidden="true">
            <span>Like</span>
            <span>Comment</span>
            <span>Repost</span>
            <span>Send</span>
          </div>
        </motion.article>
      </div>
    </section>
  );
};
