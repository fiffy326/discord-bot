import Command from "../../interfaces/command.js";
import { SlashCommandBuilder, User } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show a user's avatar image")
    .addUserOption(option =>
      option.setName("user").setDescription("User who's avatar to show"))
    .addBooleanOption(option =>
      option.setName("ephemeral").setDescription("Only show response to you")
    ),
  async execute(interaction: any) {
    const ephemeral: boolean = interaction.options.getBoolean("ephemeral");
    const user: User | null = interaction.options.getUser("user");
    let avatarURL: string;

    if (!user) {
      avatarURL = interaction.user.displayAvatarURL({ size: 4096 });
    } else {
      avatarURL = user.displayAvatarURL({ size: 4096 });
    }

    interaction.reply({ content: avatarURL.toString(), ephemeral: ephemeral });
  },
};

export default command;
