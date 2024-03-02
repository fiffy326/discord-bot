import { SlashCommandBuilder } from "discord.js";
import Command from "../../base/interfaces/command.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user")
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const response = `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`;
    await interaction.reply({ content: response, ephemeral: ephemeral });
  },
};

export default command;
