const { InlineKeyboard, InputFile } = require('grammy');
const { generateLogo } = require('../generators/logoGenerator');
const { notifyAdmin } = require('../utils/adminNotifier');

async function logoWizard(conversation, ctx) {
  const data = {};

  await ctx.reply("🏷️ What's your *brand name*?", { parse_mode: 'Markdown' });
  const nameCtx = await conversation.waitFor('message:text');
  data.brandName = nameCtx.message.text;

  await ctx.reply("✏️ Enter a *tagline* (or send /skip)", { parse_mode: 'Markdown' });
  const taglineCtx = await conversation.wait();
  if (taglineCtx.message?.text && taglineCtx.message.text !== '/skip') {
    data.tagline = taglineCtx.message.text;
  } else {
    data.tagline = null;
  }

  const colorKeyboard = new InlineKeyboard()
    .text("🌊 Ocean", "color_ocean")
    .text("🌅 Sunset", "color_sunset")
    .text("🌲 Forest", "color_forest").row()
    .text("👑 Royal", "color_royal")
    .text("🌙 Midnight", "color_midnight")
    .text("🌍 Earth", "color_earth");
  await ctx.reply("🎨 Select a color scheme:", { reply_markup: colorKeyboard });
  const colorQuery = await conversation.waitForCallbackQuery(/color_/);
  data.colors = colorQuery.callbackQuery.data.replace('color_', '');
  await colorQuery.answerCallbackQuery();

  const styleKeyboard = new InlineKeyboard()
    .text("🔤 Monogram", "style_monogram")
    .text("✍️ Wordmark", "style_wordmark").row()
    .text("🎯 Icon + Text", "style_icontext")
    .text("🛡️ Badge", "style_badge").row()
    .text("💎 Geometric", "style_geometric")
    .text("🌈 Gradient", "style_gradient");
  await ctx.reply("🎨 Select logo style:", { reply_markup: styleKeyboard });
  const styleQuery = await conversation.waitForCallbackQuery(/style_/);
  const style = styleQuery.callbackQuery.data.replace('style_', '');
  await styleQuery.answerCallbackQuery();

  if (style === 'icontext') {
    const iconKeyboard = new InlineKeyboard()
      .text("💎 Diamond", "icon_0").text("⬡ Hexagon", "icon_1").text("🛡️ Shield", "icon_2").row()
      .text("⭐ Star", "icon_3").text("🏔️ Mountain", "icon_4").text("🍃 Leaf", "icon_5").row()
      .text("⚡ Bolt", "icon_6").text("👑 Crown", "icon_7").text("🌊 Wave", "icon_8").row()
      .text("⭕ Ring", "icon_9").text("⬆️ Arrow", "icon_10").text("📦 Cube", "icon_11");
    await ctx.reply("🎯 Select an icon:", { reply_markup: iconKeyboard });
    const iconQuery = await conversation.waitForCallbackQuery(/icon_/);
    data.iconIndex = parseInt(iconQuery.callbackQuery.data.replace('icon_', ''));
    await iconQuery.answerCallbackQuery();
  } else {
    data.iconIndex = 0;
  }

  await ctx.reply("⏳ Generating your logo...\n_Powered by MuluCreatives_ ✨", { parse_mode: 'Markdown' });

  try {
    const { standard, transparent, favicon } = await conversation.external(() => generateLogo(data, style));
    
    await ctx.replyWithPhoto(new InputFile(standard, 'MuluCreatives_Logo.png'), {
      caption: `✨ *Your MuluCreatives Logo — Standard Version*\n\n🏷️ ${data.brandName}${data.tagline ? `\n✏️ "${data.tagline}"` : ''}\n🎨 Style: ${style} | Colors: ${data.colors}\n\n_Made with MuluCreatives_ @MuluCreativesbot`,
      parse_mode: 'Markdown'
    });
    await ctx.replyWithDocument(new InputFile(transparent, 'MuluCreatives_Logo_Transparent.png'), {
      caption: "🔲 Transparent PNG — Use on any background!"
    });
    await ctx.replyWithPhoto(new InputFile(favicon, 'MuluCreatives_Favicon.png'), {
      caption: "🔷 Favicon (128×128) — For websites & apps"
    });

    const finishKeyboard = new InlineKeyboard()
      .text("📦 Create Mockups", "mockup_logo").row()
      .text("🔄 Try Another Style", "menu_logo")
      .text("🏠 Main Menu", "back_menu");
    await ctx.reply("What's next? 👇", { reply_markup: finishKeyboard });

    // Notify admin
    await conversation.external(() =>
      notifyAdmin(
        ctx.api,
        '🏷️ Logo Design',
        `Brand: ${data.brandName}${data.tagline ? `\nTagline: ${data.tagline}` : ''}\nStyle: ${style}\nColors: ${data.colors}`,
        ctx,
        standard
      )
    );
  } catch (error) {
    await ctx.reply("❌ Sorry, an error occurred. Please try again or contact @MuluCreativesbot");
    console.error('[MuluCreatives] Logo generation error:', error);
  }
}

module.exports = { logoWizard };
