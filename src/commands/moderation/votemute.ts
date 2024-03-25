import Command from "../../interfaces/command.js";
import config from "../../utils/config.js";
import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  TextBasedChannel,
} from "discord.js";
import ms from "ms";

const muteThreshold = config.bot.muteThreshold + 1;
const muteRoleName = config.bot.muteRole;
const muteDuration = ms(config.bot.muteDuration);
const voteDuration = ms("30m");
const voteEmoji = "🔇";

function isMuted(member: GuildMember): boolean {
  return member.roles.cache.has(muteRoleName);
}

function mute(member: GuildMember, channel: TextBasedChannel): void {
  const muteRole = member.guild.roles.cache.find(r => r.name === muteRoleName);
  if (isMuted(member)) return;
  member.roles.add(muteRole!);
  channel.send(`${member} has been muted.`);
  setTimeout(() => member.roles.remove(muteRole!), muteDuration);
}

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("votemute")
    .setDescription("Starts a vote to mute a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User to mute").setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    const channel = interaction.channel;
    const user = interaction.options.getUser("user");
    const member = guild!.members.cache.find(m => m.id === user!.id);

    await interaction.reply(
      `Should ${user} be muted?\n(${muteThreshold} votes required)`
    );

    const message = await interaction.fetchReply();

    message.react(voteEmoji);

    const votes = message.createReactionCollector({
      filter: r => r.emoji.name === voteEmoji,
      time: voteDuration,
    });

    votes.on("collect", () => {
      if (votes.total >= muteThreshold) mute(member!, channel!);
    });

    votes.on("remove", () => {
      if (votes.total >= muteThreshold) mute(member!, channel!);
    });
  },
};

export default command;
