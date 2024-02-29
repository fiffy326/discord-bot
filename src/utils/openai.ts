import config from "../../config.json" with { type: "json" };
import log from "./log.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: config.apis.openai.secretKey });

export async function openaiImage(model: string, prompt: string) {
  const params: OpenAI.ImageGenerateParams = {
    model: model,
    prompt: prompt,
    size: "1792x1024",
    quality: "hd",
    style: "vivid",
    n: 1,
  };
  try {
    return (await openai.images.generate(params)).data[0].url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    log.error(error.message);
    return error.message;
  }
}

export async function openaiText(model: string, prompt: string) {
  const params: OpenAI.ChatCompletionCreateParams = {
    model: model,
    messages: [{ role: "user", content: prompt }],
  };
  try {
    return (await openai.chat.completions.create(params)).choices[0].message
      .content;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    log.error(error.message);
    return error.message;
  }
}

export default { openaiImage, openaiText };
