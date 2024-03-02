import { SlashCommandBuilder } from "discord.js";
import Command from "../../base/interfaces/command.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server")
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const response = `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`;
    await interaction.reply({ content: response, ephemeral: ephemeral });
  },
};

export default command;
