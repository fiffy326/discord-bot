import { Command } from "@bot/command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Generate a Magic 8 Ball answer")
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the optional arguments.
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Select a random Magic 8 Ball response.
    const responses = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes definitely.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Send a reply with the selected Magic 8 Ball response.
    await interaction.reply({ content: response, ephemeral: ephemeral });
  },
} as Command;
