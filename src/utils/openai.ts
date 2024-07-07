import { config } from "./config.js";
import { OpenAI } from "openai";

export const openai = new OpenAI({ apiKey: config.environment.OPENAI_API_TOKEN });
