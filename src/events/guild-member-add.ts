import config from "../utils/config.js";
import Event from "../interfaces/event.js";
import { Events, GuildMember, TextChannel } from "discord.js";

export const event: Event = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    const welcomeChannelId = config.bot.welcomeChannelId;
    const welcomeChannel = <TextChannel>(
      await member.client.channels.fetch(welcomeChannelId)
    );
    if (member.guild != welcomeChannel.guild) return;
    welcomeChannel.send(`Welcome to the server, ${member}!`);
  },
};

export default event;
