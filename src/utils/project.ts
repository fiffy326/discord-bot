import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const packageJsonPath = resolve(import.meta.dirname, "../../package.json");
const packageJsonText = await readFile(packageJsonPath, "utf8");
export const project = JSON.parse(packageJsonText);
