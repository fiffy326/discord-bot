import Command from "../../interfaces/command.js";
import truncate from "../../utils/truncate.js";
import { openaiImage, openaiText } from "../../utils/openai.js";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Generates a response using AI")
    .addStringOption(option =>
      option
        .setName("model")
        .setDescription("Model to use when generating response")
        .setRequired(true)
        .addChoices(
          { name: "GPT-3.5-Turbo", value: "gpt-3.5-turbo" },
          { name: "GPT-4", value: "gpt-4" },
          { name: "DALL-E-2", value: "dall-e-2" },
          { name: "DALL-E-3", value: "dall-e-3" }
        )
    )
    .addStringOption(option =>
      option
        .setName("prompt")
        .setDescription("Prompt to use when generating response")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  async execute(interaction: any) {
    const model = interaction.options.getString("model");
    const prompt = interaction.options.getString("prompt");
    const ephemeral = interaction.options.getBoolean("ephemeral");
    await interaction.deferReply({ ephemeral: ephemeral });
    let response;
    switch (model) {
      case "dall-e-2":
      case "dall-e-3":
        response = truncate(await openaiImage(model, prompt), 2000);
        break;
      case "gpt-3.5-turbo":
      case "gpt-4":
        response = truncate(await openaiText(model, prompt), 2000);
        break;
    }
    await interaction.editReply(response);
  },
};

export default command;
