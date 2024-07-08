import { Client } from "@bot/client.js";
import { Event } from "@bot/event.js";
import { log } from "@utils/log.js";
import { ChatInputCommandInteraction, Interaction } from "discord.js";

async function dispatchCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const client = interaction.client as Client;
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    const errorMessage = `Command not found: ${interaction.commandName}`;
    await interaction.reply({ content: errorMessage, ephemeral: true });
    log.error(errorMessage);
    return;
  }

  try {
    await command.callback(interaction);
  } catch (e) {
    log.error((e as Error).message);
    const errorMessage = "Failed to execute command";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
}

export default {
  name: "interactionCreate",
  async callback(interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      await dispatchCommand(interaction);
    }
  },
} as Event;
