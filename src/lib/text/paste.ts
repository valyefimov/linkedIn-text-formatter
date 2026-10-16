const BLANK = "⠀";

/**
 * LinkedIn's composer collapses empty lines on paste, so each blank line gets an
 * invisible Braille blank that it keeps.
 */
export const keepBlankLines = (text: string): string =>
  text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => (line.trim() === "" ? BLANK : line))
    .join("\n");
