import Command from "../../interfaces/command.js";
import config from "../../utils/config.js";
import Discord, { GuildMember, ReactionCollector, SlashCommandBuilder } from "discord.js";

const muteThreshold = config.bot.muteThreshold;
const mutedRoleName = config.bot.mutedRole;
const muteDuration = config.bot.muteDuration;
const voteDuration = config.bot.voteDuration;
const yesEmoji = "✅";
const noEmoji = "🚫";

function muteMember(member: GuildMember) {
  console.log(`Muting ${member}`);
  const mutedRole = member.guild.roles.cache.find(role => role.name === mutedRoleName);
  if (!member.roles.cache.has(mutedRoleName)) {
    member.roles.add(mutedRole!);
    setTimeout(() => {
      member.roles.remove(mutedRole!);
    }, muteDuration);
  }
}

function votePassed(yesVotes: ReactionCollector, noVotes: ReactionCollector): boolean {
  return ((yesVotes.total - noVotes.total) >= muteThreshold);
}

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("votemute")
    .setDescription("Starts a vote to mute a user")
    .addUserOption(option => option
      .setName("user").setDescription("User to mute").setRequired(true)),
  async execute(interaction: Discord.ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");

    await interaction.reply(`Should ${user} be muted? (${muteThreshold - 1} net votes required)`);

    const message = await interaction.fetchReply();
    message.react(yesEmoji);
    message.react(noEmoji);

    const yesVotes = message.createReactionCollector({
      filter: reaction => reaction.emoji.name === yesEmoji,
      time: voteDuration
    });

    const noVotes = message.createReactionCollector({
      filter: reaction => reaction.emoji.name === noEmoji,
      time: voteDuration
    });

    const guild = interaction.guild;
    const member = guild!.members.cache.find(m => m.id === user!.id);

    yesVotes.on("end", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    yesVotes.on("collect", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    yesVotes.on("remove", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    yesVotes.on("ignore", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    yesVotes.on("dispose", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    noVotes.on("end", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    noVotes.on("collect", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    noVotes.on("remove",() => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    noVotes.on("ignore",() => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

    noVotes.on("dispose", () => {
      if (votePassed(yesVotes, noVotes)) muteMember(member!);
    });

  }
};

export default command;
