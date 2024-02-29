import config from "../../config.json" with { type: "json" };
import { Events, Message, TextChannel, WebhookClient } from "discord.js";

const webhookClient = new WebhookClient({ url: config.relay.outputWebhookURL });
const zeroWidthSpace = "​";

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot || message.webhookId) return;
    if (message.guildId != config.relay.inputGuildId) return;

    const channelName = (<TextChannel>message.channel).name;
    const username = message.author.username;
    const content = (!message.content) ? zeroWidthSpace : message.cleanContent;

    webhookClient.send({
      username: `${username} [#${channelName}]`,
      avatarURL: message.author.avatarURL()!,
      content: content,
      embeds: [...message.embeds.values()],
      files: [...message.attachments.values()]
    });
  },
};
