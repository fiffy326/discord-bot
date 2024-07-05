import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageInfoPath = resolve(import.meta.dirname, "../../package.json");
const packageInfoText = readFileSync(packageInfoPath, "utf8");

export const packageInfo = JSON.parse(packageInfoText);
