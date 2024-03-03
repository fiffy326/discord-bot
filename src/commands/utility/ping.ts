import Command from "../../interfaces/command.js";
import { SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's latency")
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  async execute(interaction: any) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const sent = await interaction.reply({
      content: "Calculating...",
      fetchReply: true,
      ephemeral: ephemeral,
    });
    const heartbeat = `${interaction.client.ws.ping} ms`;
    const roundtrip = `${sent.createdTimestamp - interaction.createdTimestamp} ms`;
    const response = `Websocket heartbeat: ${heartbeat}\nRoundtrip: ${roundtrip}`;
    interaction.editReply(response);
  },
};

export default command;
