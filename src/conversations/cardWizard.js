const { InlineKeyboard, InputFile } = require('grammy');
const { generateCard } = require('../generators/cardGenerator');
const { notifyAdmin } = require('../utils/adminNotifier');

async function downloadFile(ctx, fileId) {
  const file = await ctx.api.getFile(fileId);
  const url = `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`;
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

async function cardWizard(conversation, ctx) {
  const data = {};

  await ctx.reply("📝 What's your *full name*?", { parse_mode: 'Markdown' });
  const nameCtx = await conversation.waitFor('message:text');
  data.name = nameCtx.message.text;

  await ctx.reply("💼 What's your *job title*?", { parse_mode: 'Markdown' });
  const titleCtx = await conversation.waitFor('message:text');
  data.title = titleCtx.message.text;

  await ctx.reply("🏢 *Company name*?", { parse_mode: 'Markdown' });
  const companyCtx = await conversation.waitFor('message:text');
  data.company = companyCtx.message.text;

  await ctx.reply("📞 *Phone number*?", { parse_mode: 'Markdown' });
  const phoneCtx = await conversation.waitFor('message:text');
  data.phone = phoneCtx.message.text;

  await ctx.reply("📧 *Email address*?", { parse_mode: 'Markdown' });
  const emailCtx = await conversation.waitFor('message:text');
  data.email = emailCtx.message.text;

  await ctx.reply("📸 Upload a *profile photo* (or send /skip)", { parse_mode: 'Markdown' });
  const photoCtx = await conversation.wait();
  if (photoCtx.message?.photo) {
    const photo = photoCtx.message.photo[photoCtx.message.photo.length - 1];
    data.photoBuffer = await conversation.external(() => downloadFile(ctx, photo.file_id));
  } else {
    data.photoBuffer = null;
  }

  await ctx.reply("🏷️ Upload a *company logo* (or send /skip)", { parse_mode: 'Markdown' });
  const logoCtx = await conversation.wait();
  if (logoCtx.message?.photo) {
    const photo = logoCtx.message.photo[logoCtx.message.photo.length - 1];
    data.logoBuffer = await conversation.external(() => downloadFile(ctx, photo.file_id));
  } else {
    data.logoBuffer = null;
  }

  const templateKeyboard = new InlineKeyboard()
    .text("🌊 Modern", "tpl_modern")
    .text("📜 Classic", "tpl_classic").row()
    .text("⚡ Minimal", "tpl_minimal")
    .text("🔥 Bold", "tpl_bold");
  await ctx.reply("🎨 Select a template:", { reply_markup: templateKeyboard });
  const tplQuery = await conversation.waitForCallbackQuery(/tpl_/);
  const template = tplQuery.callbackQuery.data.replace('tpl_', '');
  await tplQuery.answerCallbackQuery();

  const colorKeyboard = new InlineKeyboard()
    .text("🌊 Ocean", "color_ocean")
    .text("🌅 Sunset", "color_sunset")
    .text("🌲 Forest", "color_forest").row()
    .text("👑 Royal", "color_royal")
    .text("🌙 Midnight", "color_midnight")
    .text("🌍 Earth", "color_earth");
  await ctx.reply("🎨 Select a color scheme:", { reply_markup: colorKeyboard });
  const colorQuery = await conversation.waitForCallbackQuery(/color_/);
  const colors = colorQuery.callbackQuery.data.replace('color_', '');
  await colorQuery.answerCallbackQuery();

  await ctx.reply("⏳ Generating your business card...\n_Powered by MuluCreatives_ ✨", { parse_mode: 'Markdown' });

  try {
    const cardBuffer = await conversation.external(() => generateCard(data, template, colors));
    const finishKeyboard = new InlineKeyboard()
      .text("🔄 Try Another Template", "menu_card").row()
      .text("🏠 Main Menu", "back_menu");
    await ctx.replyWithPhoto(new InputFile(cardBuffer, 'MuluCreatives_Card.png'), {
      caption: `✨ *Your MuluCreatives Business Card*\n\n👤 ${data.name}\n💼 ${data.title} — ${data.company}\n🎨 Template: ${template} | Colors: ${colors}\n\n_Made with MuluCreatives_ @MuluCreativesbot`,
      parse_mode: 'Markdown',
      reply_markup: finishKeyboard
    });

    // Notify admin
    await conversation.external(() =>
      notifyAdmin(
        ctx.api,
        '🪪 Business Card',
        `Name: ${data.name}\nTitle: ${data.title}\nCompany: ${data.company}\nTemplate: ${template}\nColors: ${colors}`,
        ctx,
        cardBuffer
      )
    );
  } catch (error) {
    await ctx.reply("❌ Sorry, an error occurred. Please try again or contact @MuluCreativesbot");
    console.error('[MuluCreatives] Card generation error:', error);
  }
}

module.exports = { cardWizard };
