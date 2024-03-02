import config from "../../config.json" with { type: "json" };
import Relay from "../base/interfaces/relay.js";
import { cleanContent, Events, Message, TextChannel, WebhookClient } from "discord.js";

const zeroWidthSpace = "​";
const relays: Array<Relay> = config.relays;

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || message.webhookId) return;
    relays.forEach((relay: Relay) => {
      if ((relay.guildIds.includes(message.guildId!.toString())) ||
          (relay.channelIds.includes(message.channelId.toString())) ||
          (relay.userIds.includes(message.author.id.toString()))) {
        let webhookClient = new WebhookClient({ url: relay.webhookURL });
        let channel = (<TextChannel>message.channel);
        let channelName = channel.name;
        let username = message.author.username;
        let content = !message.content ? zeroWidthSpace : cleanContent(message.content, channel);
        webhookClient.send({
          content: content,
          username: `${username} [#${channelName}]`,
          avatarURL: message.author.avatarURL()!,
          embeds: [...message.embeds.values()],
          files: [...message.attachments.values()]
        });
      }
    });
  },
};
