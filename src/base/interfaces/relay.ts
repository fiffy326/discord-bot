export interface Relay {
  webhookURL: string;
  guildIds: Array<string>;
  channelIds: Array<string>;
  userIds: Array<string>;
}

export default Relay;
