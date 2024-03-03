import Command from "../../interfaces/command.js";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("conch")
    .setDescription("Generates a magic conch answer.")
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  async execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const answers = [
      "Maybe someday.",
      "Nothing.",
      "Neither.",
      "I don't think so.",
      "No.",
      "Yes.",
      "Try asking again.",
      "You cannot get to the top by sitting on your bottom.",
      "I see a new sauce in your future.",
      "Ask next time.",
      "Follow the seahorse."
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];
    interaction.reply({ content: answer, ephemeral: ephemeral });
  }
};

export default command;
