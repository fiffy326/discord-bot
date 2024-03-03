import Event from "../interfaces/event.js";
import log from "../utils/log.js";
import { Events } from "discord.js";

export const event: Event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      log.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};

export default event;
