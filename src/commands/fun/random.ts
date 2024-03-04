import Command from "../../interfaces/command.js";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Generates a random number.")
    .addNumberOption(option => option.setName("min").setDescription("Minimum"))
    .addNumberOption(option => option.setName("max").setDescription("Maximum"))
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  async execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const minimum = interaction.options.getNumber("min");
    const maximum = interaction.options.getNumber("max");

    if (minimum < 0) {
      interaction.reply({
        content: "The minimum must be >= 0.",
        ephemeral: ephemeral,
      });
      return;
    }

    if (maximum > Number.MAX_SAFE_INTEGER) {
      interaction.reply({
        content: `The maximum must be <= ${Number.MAX_SAFE_INTEGER}.`,
        ephemeral: ephemeral,
      });
      return;
    }

    const answer = Math.floor(Math.random() * (maximum - minimum) + minimum);
    interaction.reply({ content: answer.toString(), ephemeral: ephemeral });
  },
};

export default command;
