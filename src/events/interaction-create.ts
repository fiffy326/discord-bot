import { Client } from "../bot/client.js";
import { Event } from "../bot/event.js";
import { log } from "../utils/log.js";
import { Interaction } from "discord.js";

export default {
  name: "interactionCreate",
  async callback(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as Client).commands.get(interaction.commandName);
    if (!command) {
      log.error(`No command found: ${interaction.commandName}`);
      return;
    }

    await command.callback(interaction).catch(async (error) => {
      log.error(error.message);
      const errorReply = "There was an error while executing this command.";
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorReply, ephemeral: true });
      } else {
        await interaction.reply({ content: errorReply, ephemeral: true });
      }
    });
  },
} as Event;
