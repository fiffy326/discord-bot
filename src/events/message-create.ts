import { Event } from "../bot/event.js";
import { Relay } from "../bot/relay.js";
import { config } from "../utils/config.js";
import { Message, TextChannel, WebhookClient } from "discord.js";

const relays: Relay[] = config.relays;
const zeroWidthSpace = String.fromCharCode(0x200b);

export default {
  name: "messageCreate",
  async callback(message: Message) {
    if (message.author.bot || message.webhookId || !message.channel.isTextBased()) return;
    for (const relay of relays) {
      const isRelayGuild = relay.guild_ids.includes(message.guildId ?? "");
      const isRelayChannel = relay.channel_ids.includes(message.channelId);
      const isRelayUser = relay.user_ids.includes(message.author.id);
      if (isRelayGuild || isRelayChannel || isRelayUser) {
        const webhookClient = new WebhookClient({ id: relay.webhook_id, token: relay.webhook_token });
        const content = message.content ? message.content.replaceAll("@", `@${zeroWidthSpace}`) : zeroWidthSpace;
        const authorName = message.author.username;
        const channelName = (message.channel as TextChannel).name;
        await webhookClient.send({
          content: content,
          username: `${authorName} [#${channelName}]`,
          avatarURL: message.author.avatarURL() ?? "",
          embeds: [...message.embeds.values()],
          files: [...message.attachments.values()],
        });
      }
    }
  },
} as Event;
