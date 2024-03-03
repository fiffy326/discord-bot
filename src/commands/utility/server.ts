import Command from "../../interfaces/command.js";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server")
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  async execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const response = `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`;
    await interaction.reply({ content: response, ephemeral: ephemeral });
  },
};

export default command;
