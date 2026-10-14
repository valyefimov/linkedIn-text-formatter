const escapeHtml = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * LinkedIn's composer reads the HTML flavor of a paste and drops bare newlines,
 * so every line becomes its own paragraph and empty lines keep their height.
 */
export const toClipboardHtml = (text: string): string =>
  text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => (line === "" ? "<p><br></p>" : `<p>${escapeHtml(line)}</p>`))
    .join("");
