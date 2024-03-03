import log from "./log.js";

export function truncate(text: string, maxLength: number): string {
  let errorMessage = "";

  if (typeof text !== "string") {
    errorMessage = `Tried to truncate a ${typeof text} with value ${text}.`;
  }

  if (text.length === 0) {
    errorMessage = `Tried to truncate an empty string.`;
  }

  if (errorMessage !== "") {
    log.error(errorMessage);
    return `Error: ${errorMessage}`;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength);
}

export default truncate;
