import { config } from "@utils/config.js";
import { OpenAI } from "openai";

export const openai = new OpenAI({ apiKey: config.env.OPENAI_API_TOKEN });
