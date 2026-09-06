export type ListKind = "bullet" | "numbered" | "check" | "arrow";

const MARKERS: Record<Exclude<ListKind, "numbered">, string> = {
  bullet: "•",
  check: "☐",
  arrow: "→",
};

const ANY_PREFIX = /^(?:[•◦▪☐☑→]|\d+\.)\s/;
const KIND_PREFIX: Record<ListKind, RegExp> = {
  bullet: /^•\s/,
  numbered: /^\d+\.\s/,
  check: /^[☐☑]\s/,
  arrow: /^→\s/,
};

/**
 * Turns the non-empty lines of `text` into a list of the given kind. If every line is
 * already that kind of list, the markers are removed instead. Other list markers are replaced.
 */
export const toggleList = (text: string, kind: ListKind): string => {
  const lines = text.split("\n");
  const filled = lines.filter((line) => line.trim() !== "");
  if (filled.length === 0) return text;

  const remove = filled.every((line) => KIND_PREFIX[kind].test(line));
  let n = 0;
  return lines
    .map((line) => {
      if (line.trim() === "") return line;
      const body = line.replace(ANY_PREFIX, "");
      if (remove) return body;
      n++;
      return `${kind === "numbered" ? `${n}.` : MARKERS[kind]} ${body}`;
    })
    .join("\n");
};
