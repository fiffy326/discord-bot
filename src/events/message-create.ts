import config from "../utils/config.js";
import Event from "../interfaces/event.js";
import Relay from "../interfaces/relay.js";
import { Events, Message, TextChannel, WebhookClient } from "discord.js";

const zeroWidthSpace = "​";
const relays: Array<Relay> = config.relays;

export const event: Event = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || message.webhookId) return;
    relays.forEach((relay: Relay) => {
      if (
        relay.guildIds.includes(message.guildId!) ||
        relay.channelIds.includes(message.channelId) ||
        relay.userIds.includes(message.author.id)
      ) {
        const webhookClient = new WebhookClient({ url: relay.webhookURL });
        const channel = <TextChannel>message.channel;
        const channelName = channel.name;
        const username = message.author.username;

        let content: string;

        if (!message.content) {
          content = zeroWidthSpace;
        } else {
          content = message.cleanContent
            .replaceAll("@everyone", `@${zeroWidthSpace}everyone`)
            .replaceAll("@here", `@${zeroWidthSpace}here`);
        }

        webhookClient.send({
          content: content,
          username: `${username} [#${channelName}]`,
          avatarURL: message.author.avatarURL()!,
          embeds: [...message.embeds.values()],
          files: [...message.attachments.values()],
        });
      }
    });
  },
};

export default event;
