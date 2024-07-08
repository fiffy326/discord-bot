import { Command } from "../bot/command.js";
import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

export default {
  data: new SlashCommandBuilder()
    .setName("webpage")
    .setDescription("Display a webpage")
    .addStringOption((option) => option.setName("url").setDescription("Webpage URL").setRequired(true))
    .addIntegerOption((option) => option.setName("width").setDescription("Viewport width (default: 1920)"))
    .addIntegerOption((option) => option.setName("height").setDescription("Viewport height (default: 1080)"))
    .addBooleanOption((option) => option.setName("ephemeral").setDescription("Only show to you (default: false)")),
  async callback(interaction: ChatInputCommandInteraction): Promise<void> {
    // Get the required arguments.
    const url = interaction.options.getString("url") ?? "";

    // Get the optional arguments.
    const width = interaction.options.getInteger("width") ?? 1920;
    const height = interaction.options.getInteger("height") ?? 1080;
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    // Make sure the arguments are valid.
    if (width < 1) {
      await interaction.reply({ content: "Minimum viewport width is 1 px", ephemeral: ephemeral });
      return;
    }
    if (width > 4096) {
      await interaction.reply({ content: "Maximum viewport width is 4096 px", ephemeral: ephemeral });
      return;
    }
    if (height < 1) {
      await interaction.reply({ content: "Minimum viewport height is 1 px", ephemeral: ephemeral });
      return;
    }
    if (height > 2160) {
      await interaction.reply({ content: "Maximum viewport height is 2160 px", ephemeral: ephemeral });
      return;
    }

    // Defer the reply until the screenshot has been taken.
    await interaction.deferReply({ ephemeral: ephemeral });

    // Take a screenshot of the webpage.
    const filePath = resolve(import.meta.dirname, `../../data/screenshots/${Date.now()}.png`);
    const browser = await puppeteer.launch({ defaultViewport: { width: width, height: height } });
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: filePath });
    await browser.close();

    // Update the reply with the webpage screenshot.
    const attachment = new AttachmentBuilder(filePath);
    await interaction.editReply({ files: [attachment] });
  },
} as Command;
