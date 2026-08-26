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

  await ctx.reply("📝 What's your *full name*? (e.g. Abel Tesfaye)", { parse_mode: 'Markdown' });
  const nameCtx = await conversation.waitFor('message:text');
  data.name = nameCtx.message.text;

  await ctx.reply("💼 What's your *job title*? (e.g. Graphic Designer)", { parse_mode: 'Markdown' });
  const titleCtx = await conversation.waitFor('message:text');
  data.title = titleCtx.message.text;

  await ctx.reply("🏢 What's your *company or brand name*? (e.g. ABEL DESIGNS)", { parse_mode: 'Markdown' });
  const companyCtx = await conversation.waitFor('message:text');
  data.company = companyCtx.message.text;

  await ctx.reply("📞 What's your *phone number*? (e.g. +251 912 345 678)", { parse_mode: 'Markdown' });
  const phoneCtx = await conversation.waitFor('message:text');
  data.phone = phoneCtx.message.text;

  await ctx.reply("✈️ What's your *Telegram handle* or Website? (e.g. @abel_designs or /skip)", { parse_mode: 'Markdown' });
  const tgCtx = await conversation.wait();
  if (tgCtx.message?.text && tgCtx.message.text !== '/skip') {
    data.telegram = tgCtx.message.text;
  } else {
    data.telegram = '@mulucreatives';
  }

  await ctx.reply("📧 What's your *email address*? (e.g. abeltesfaye@gmail.com)", { parse_mode: 'Markdown' });
  const emailCtx = await conversation.waitFor('message:text');
  data.email = emailCtx.message.text;

  await ctx.reply("📍 What's your *city/location*? (e.g. Bole, Addis Ababa, Ethiopia or /skip)", { parse_mode: 'Markdown' });
  const locCtx = await conversation.wait();
  if (locCtx.message?.text && locCtx.message.text !== '/skip') {
    data.location = locCtx.message.text;
  } else {
    data.location = 'Addis Ababa, Ethiopia';
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
    .text("🌊 Modern Corporate (Abel Style)", "tpl_modern")
    .text("📜 Classic Gold", "tpl_classic").row()
    .text("⚡ Minimal Line", "tpl_minimal")
    .text("🔥 Bold Split", "tpl_bold");
  await ctx.reply("🎨 Select a template style:", { reply_markup: templateKeyboard });
  const tplQuery = await conversation.waitForCallbackQuery(/tpl_/);
  const template = tplQuery.callbackQuery.data.replace('tpl_', '');
  await tplQuery.answerCallbackQuery();

  const colorKeyboard = new InlineKeyboard()
    .text("🌊 Ocean Blue", "color_ocean")
    .text("🌅 Sunset Red", "color_sunset")
    .text("🌲 Forest Green", "color_forest").row()
    .text("👑 Royal Purple", "color_royal")
    .text("🌙 Midnight Dark", "color_midnight")
    .text("🌍 Earth Brown", "color_earth");
  await ctx.reply("🎨 Select a color theme:", { reply_markup: colorKeyboard });
  const colorQuery = await conversation.waitForCallbackQuery(/color_/);
  const colors = colorQuery.callbackQuery.data.replace('color_', '');
  await colorQuery.answerCallbackQuery();

  await ctx.reply("⏳ Generating high-resolution 2-sided printable business card...\n_Powered by MuluCreatives_ ✨", { parse_mode: 'Markdown' });

  try {
    const cardResult = await conversation.external(() => generateCard(data, template, colors));
    const { front, back, preview } = cardResult;

    const finishKeyboard = new InlineKeyboard()
      .text("🔄 Try Another Style", "menu_card").row()
      .text("🏠 Main Menu", "back_menu");

    // 1. Send Visual Showcase Photo
    await ctx.replyWithPhoto(new InputFile(preview, 'MuluCreatives_Showcase.png'), {
      caption: `✨ *Your 2-Sided Business Card is Ready!*\n\n👤 *${data.name}*\n💼 ${data.title} — ${data.company}\n📞 ${data.phone}\n📍 ${data.location}\n\n📁 *Printable files sent below!* Uncompressed 300 DPI PNG format for physical printing. 🖨️\n\n_Made with MuluCreatives_ @MuluCreativesbot`,
      parse_mode: 'Markdown'
    });

    // 2. Send Uncompressed High-Res Printable Documents (Front & Back)
    await ctx.replyWithDocument(new InputFile(front, `${data.name.replace(/\s+/g, '_')}_Card_Front_300DPI.png`), {
      caption: `🖨️ *Front Side* (High-Resolution 300 DPI Printable File)`
    });

    await ctx.replyWithDocument(new InputFile(back, `${data.name.replace(/\s+/g, '_')}_Card_Back_300DPI.png`), {
      caption: `🖨️ *Back Side* (High-Resolution 300 DPI Printable File with QR Code)`,
      reply_markup: finishKeyboard
    });

    // Notify admin
    await conversation.external(() =>
      notifyAdmin(
        ctx.api,
        '🪪 Printable Business Card (2-Sided)',
        `Name: ${data.name}\nTitle: ${data.title}\nCompany: ${data.company}\nPhone: ${data.phone}\nLocation: ${data.location}\nTemplate: ${template}`,
        ctx,
        preview
      )
    );
  } catch (error) {
    await ctx.reply("❌ Sorry, an error occurred while generating the business card. Please try again or contact @MuluCreativesbot");
    console.error('[MuluCreatives] Card generation error:', error);
  }
}

module.exports = { cardWizard };
