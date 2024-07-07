import { Command } from "../bot/command.js";
import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

export default {
  data: new SlashCommandBuilder()
    .setName("webpage")
    .setDescription("View a webpage")
    .addStringOption((option) => option.setName("url").setDescription("URL of webpage").setRequired(true))
    .addBooleanOption((option) =>
      option.setName("ephemeral").setDescription("Only show response to you (default: false"),
    )
    .addIntegerOption((option) => option.setName("width").setDescription("Viewport width (default: 1920)"))
    .addIntegerOption((option) => option.setName("height").setDescription("Viewport height (default: 1080)")),
  async callback(interaction: ChatInputCommandInteraction) {
    const url = interaction.options.getString("url") ?? "";
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;
    const width = interaction.options.getInteger("width") ?? 1920;
    const height = interaction.options.getInteger("height") ?? 1080;

    await interaction.deferReply({ ephemeral: ephemeral });

    const fileName = `${Date.now().toString()}.png`;
    const filePath = resolve(import.meta.dirname, `../../data/screenshots/${fileName}`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: width, height: height });
    await page.screenshot({ path: filePath });
    await browser.close();

    const attachment = new AttachmentBuilder(filePath);

    await interaction.editReply({ files: [attachment] });
  },
} as Command;
