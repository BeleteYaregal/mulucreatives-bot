const { InlineKeyboard, InputFile } = require('grammy');
const { generateCard } = require('../generators/cardGenerator');
const { notifyAdmin } = require('../utils/adminNotifier');
const { validatePhone, validateEmail, validateWebsite, validateTelegram } = require('../utils/validators');
const { db } = require('../database/db');

async function downloadFile(ctx, fileId) {
  const file = await ctx.api.getFile(fileId);
  const url = `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`;
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function cardWizard(conversation, ctx) {
  try {
    const user = ctx.from;
    db.saveUser({ id: user.id, firstName: user.first_name, lastName: user.last_name, username: user.username });

  const data = {
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    telegram: '',
    website: '',
    location: '',
    logoBuffer: null,
    template: 'swissMinimal',
    colors: 'obsidian_ivory'
  };

  // --- Step 1: 10 Professional Design Families Keyboard ---
  const tplKeyboard = new InlineKeyboard()
    .text("01 | Swiss Minimal", "tpl_swissMinimal")
    .text("02 | Dark Luxury", "tpl_darkLuxury").row()
    .text("03 | Modern Corporate", "tpl_modernCorporate")
    .text("04 | Editorial", "tpl_editorial").row()
    .text("05 | Technology", "tpl_technology")
    .text("06 | Creative", "tpl_creative").row()
    .text("07 | Ethiopian Modern 🇪🇹", "tpl_ethiopianModern")
    .text("08 | Dark Premium", "tpl_darkPremium").row()
    .text("09 | Elegant Serif", "tpl_elegantSerif")
    .text("10 | Executive Monogram", "tpl_executiveMonogram");

  await ctx.reply("🎨 <b>Select a Professional Design Family:</b>\n\n<i>Each template family has a unique, agency-grade layout &amp; composition.</i>", { parse_mode: 'HTML', reply_markup: tplKeyboard });
  const tplQuery = await conversation.waitForCallbackQuery(/^tpl_/);
  data.template = tplQuery.callbackQuery.data.replace('tpl_', '');
  await tplQuery.answerCallbackQuery("Template selected!").catch(() => {});

  // --- Step 2: Form Collection ---
  await ctx.reply("📝 What is your <b>Full Name</b>? (e.g. Abel Tesfaye)", { parse_mode: 'HTML' });
  const nameCtx = await conversation.waitFor('message:text');
  data.name = nameCtx.message.text.trim();

  await ctx.reply("💼 What is your <b>Job Title</b>? (e.g. Senior Creative Director)", { parse_mode: 'HTML' });
  const titleCtx = await conversation.waitFor('message:text');
  data.title = titleCtx.message.text.trim();

  await ctx.reply("🏢 What is your <b>Company or Brand Name</b>? (e.g. MuluCreatives)", { parse_mode: 'HTML' });
  const companyCtx = await conversation.waitFor('message:text');
  data.company = companyCtx.message.text.trim();

  // Phone validation loop
  let validPhone = false;
  while (!validPhone) {
    await ctx.reply("📞 What is your <b>Phone Number</b>? (e.g. +251 901 135 018)", { parse_mode: 'HTML' });
    const phoneCtx = await conversation.waitFor('message:text');
    const res = validatePhone(phoneCtx.message.text.trim());
    if (res.valid) {
      data.phone = res.formatted;
      validPhone = true;
    } else {
      await ctx.reply("⚠️ Invalid phone number format. Please enter a valid phone number (e.g., 0901135018).");
    }
  }

  // Email validation
  await ctx.reply("📧 What is your <b>Email Address</b>? (or send /skip)", { parse_mode: 'HTML' });
  const emailCtx = await conversation.waitFor(['message:text', 'message:photo']);
  if (emailCtx.message?.text && emailCtx.message.text !== '/skip') {
    const res = validateEmail(emailCtx.message.text.trim());
    data.email = res.formatted;
  }

  // Telegram validation
  await ctx.reply("✈️ What is your <b>Telegram Handle</b>? (e.g. @beleteyaregal or /skip)", { parse_mode: 'HTML' });
  const tgCtx = await conversation.waitFor(['message:text', 'message:photo']);
  if (tgCtx.message?.text && tgCtx.message.text !== '/skip') {
    const res = validateTelegram(tgCtx.message.text.trim());
    data.telegram = res.formatted;
  }

  // Website validation
  await ctx.reply("🌐 What is your <b>Website URL</b>? (e.g. mulucreatives.com or /skip)", { parse_mode: 'HTML' });
  const webCtx = await conversation.waitFor(['message:text', 'message:photo']);
  if (webCtx.message?.text && webCtx.message.text !== '/skip') {
    const res = validateWebsite(webCtx.message.text.trim());
    data.website = res.formatted;
  }

  // Address
  await ctx.reply("📍 What is your <b>City/Address</b>? (e.g. Addis Ababa, Ethiopia or /skip)", { parse_mode: 'HTML' });
  const locCtx = await conversation.waitFor(['message:text', 'message:photo']);
  if (locCtx.message?.text && locCtx.message.text !== '/skip') {
    data.location = locCtx.message.text.trim();
  }

  // Logo upload
  await ctx.reply("🏷️ Upload your <b>Company Logo</b> (image or /skip)", { parse_mode: 'HTML' });
  const logoCtx = await conversation.waitFor(['message:text', 'message:photo']);
  if (logoCtx.message?.photo) {
    const photo = logoCtx.message.photo[logoCtx.message.photo.length - 1];
    data.logoBuffer = await conversation.external(() => downloadFile(ctx, photo.file_id));
  }

  // Color Palette Selection (9 Professional Palettes)
  const colorKeyboard = new InlineKeyboard()
    .text("⬛ Obsidian & Ivory", "color_obsidian_ivory")
    .text("⚪ Swiss Clean", "color_swiss_clean").row()
    .text("🔵 Navy & Silver", "color_navy_silver")
    .text("👑 Charcoal & Gold", "color_charcoal_gold").row()
    .text("🌲 Forest & Cream", "color_forest_cream")
    .text("🍷 Burgundy & Ivory", "color_burgundy_ivory").row()
    .text("⚡ Slate & Cyan", "color_slate_cyan")
    .text("🧱 Terracotta & Cream", "color_terracotta_cream").row()
    .text("🇪🇹 Ethiopian Modern", "color_ethiopian_modern");

  await ctx.reply("🎨 <b>Select a Color Palette:</b>", { parse_mode: 'HTML', reply_markup: colorKeyboard });
  const colorQuery = await conversation.waitForCallbackQuery(/^color_/);
  data.colors = colorQuery.callbackQuery.data.replace('color_', '');
  await colorQuery.answerCallbackQuery("Palette selected!").catch(() => {});

  // --- Step 3: Interactive Live Preview Loop ---
  let isEditing = true;

  while (isEditing) {
    await ctx.reply("⏳ <b>Rendering live business card preview...</b>", { parse_mode: 'HTML' });

    let cardResult;
    try {
      cardResult = await conversation.external(() => generateCard(data, data.template, data.colors));
    } catch (err) {
      console.error("Rendering error:", err);
      await ctx.reply("❌ Error rendering preview. Falling back to default styling.");
      cardResult = await conversation.external(() => generateCard(data, 'swissMinimal', 'obsidian_ivory'));
    }

    const editKeyboard = new InlineKeyboard()
      .text("✏️ Edit Name", "edit_name")
      .text("✏️ Edit Title", "edit_title").row()
      .text("✏️ Edit Company", "edit_company")
      .text("✏️ Edit Phone", "edit_phone").row()
      .text("✏️ Edit Email", "edit_email")
      .text("✏️ Edit Telegram", "edit_telegram").row()
      .text("🎨 Change Template", "edit_template")
      .text("🎨 Change Color", "edit_color").row()
      .text("🔄 Regenerate", "edit_refresh").row()
      .text("✅ CONFIRM & DOWNLOAD FILES", "confirm_order").row()
      .text("🏠 Main Menu", "back_menu");

    const captionText = `✨ <b>MuluCreatives Live Card Preview</b>\n\n👤 <b>Name:</b> ${escapeHtml(data.name)}\n💼 <b>Title:</b> ${escapeHtml(data.title)}\n🏢 <b>Company:</b> ${escapeHtml(data.company)}\n📞 <b>Phone:</b> ${escapeHtml(data.phone)}\n📧 <b>Email:</b> ${escapeHtml(data.email || 'None')}\n✈️ <b>Telegram:</b> ${escapeHtml(data.telegram || 'None')}\n🎨 <b>Template:</b> ${data.template} | <b>Palette:</b> ${data.colors}\n\n<i>Review your design or use the buttons below to edit:</i>`;

    await ctx.replyWithPhoto(new InputFile(cardResult.previewBuffer, 'Preview.png'), {
      caption: captionText,
      parse_mode: 'HTML',
      reply_markup: editKeyboard
    });

    const actionQuery = await conversation.waitForCallbackQuery(/^(edit_|confirm_order|back_menu)/);
    const action = actionQuery.callbackQuery.data;
    await actionQuery.answerCallbackQuery("Processing request...").catch(() => {});

    if (action === 'confirm_order') {
      isEditing = false;
      await ctx.reply("🎉 <b>Order Confirmed!</b> Generating high-definition printable files &amp; PDF...", { parse_mode: 'HTML' });

      // Save Card to Database
      const cardRecord = db.saveBusinessCard({
        userId: user.id,
        templateId: data.template,
        name: data.name,
        jobTitle: data.title,
        company: data.company,
        phone: data.phone,
        email: data.email,
        telegram: data.telegram,
        website: data.website,
        address: data.location,
        primaryColor: data.colors
      });

      // Save Order to Database
      const orderRecord = db.createOrder({
        userId: user.id,
        cardId: cardRecord.id,
        status: 'COMPLETED',
        price: 'FREE'
      });

      // Deliver Files
      const finishKeyboard = new InlineKeyboard()
        .text("🪪 Create Another Card", "menu_card").row()
        .text("🏠 Main Menu", "back_menu");

      await ctx.replyWithPhoto(new InputFile(cardResult.previewBuffer, 'Showcase.png'), {
        caption: `✅ <b>Order #${orderRecord.id.slice(0, 8)} Completed!</b>\n\nThank you for choosing MuluCreatives! Your printable business card files are attached below. 🖨️`,
        parse_mode: 'HTML'
      });

      // Send High-Res PNG Documents
      await ctx.replyWithDocument(new InputFile(cardResult.frontBuffer, `${data.name.replace(/\s+/g, '_')}_Front_300DPI.png`), {
        caption: `📄 <b>Front Side</b> (300 DPI High-Resolution PNG)`,
        parse_mode: 'HTML'
      });

      if (cardResult.backBuffer) {
        await ctx.replyWithDocument(new InputFile(cardResult.backBuffer, `${data.name.replace(/\s+/g, '_')}_Back_300DPI.png`), {
          caption: `📄 <b>Back Side</b> (300 DPI High-Resolution Vector PNG)`,
          parse_mode: 'HTML'
        });
      }

      // Send Print-Ready PDF
      if (cardResult.pdfPath) {
        await ctx.replyWithDocument(new InputFile(cardResult.pdfPath, `${data.name.replace(/\s+/g, '_')}_PrintReady.pdf`), {
          caption: `🖨️ <b>Official Print-Ready Vector PDF Document</b> (Standard 3.5" x 2")`,
          reply_markup: finishKeyboard,
          parse_mode: 'HTML'
        });
      }

      // Notify Admin
      await conversation.external(() =>
        notifyAdmin(
          ctx.api,
          '🪪 Business Card Order',
          `Order ID: #${orderRecord.id.slice(0, 8)}\nName: ${data.name}\nTitle: ${data.title}\nCompany: ${data.company}\nPhone: ${data.phone}\nTemplate: ${data.template}`,
          ctx,
          cardResult.previewBuffer
        )
      );

    } else if (action === 'back_menu') {
      isEditing = false;
      await ctx.reply("Returning to main menu...");
    } else if (action === 'edit_name') {
      await ctx.reply("📝 Enter new <b>Full Name</b>:", { parse_mode: 'HTML' });
      const editMsg = await conversation.waitFor('message:text');
      data.name = editMsg.message.text.trim();
    } else if (action === 'edit_title') {
      await ctx.reply("💼 Enter new <b>Job Title</b>:", { parse_mode: 'HTML' });
      const editMsg = await conversation.waitFor('message:text');
      data.title = editMsg.message.text.trim();
    } else if (action === 'edit_company') {
      await ctx.reply("🏢 Enter new <b>Company Name</b>:", { parse_mode: 'HTML' });
      const editMsg = await conversation.waitFor('message:text');
      data.company = editMsg.message.text.trim();
    } else if (action === 'edit_phone') {
      await ctx.reply("📞 Enter new <b>Phone Number</b>:", { parse_mode: 'HTML' });
      const editMsg = await conversation.waitFor('message:text');
      const res = validatePhone(editMsg.message.text.trim());
      if (res.valid) data.phone = res.formatted;
    } else if (action === 'edit_email') {
      await ctx.reply("📧 Enter new <b>Email Address</b>:", { parse_mode: 'HTML' });
      const editMsg = await conversation.waitFor('message:text');
      const res = validateEmail(editMsg.message.text.trim());
      if (res.valid) data.email = res.formatted;
    } else if (action === 'edit_telegram') {
      await ctx.reply("✈️ Enter new <b>Telegram Handle</b>:", { parse_mode: 'HTML' });
      const editMsg = await conversation.waitFor('message:text');
      const res = validateTelegram(editMsg.message.text.trim());
      if (res.valid) data.telegram = res.formatted;
    } else if (action === 'edit_template') {
      await ctx.reply("🎨 Select a Professional Design Family:", { reply_markup: tplKeyboard });
      const editTplQuery = await conversation.waitForCallbackQuery(/^tpl_/);
      data.template = editTplQuery.callbackQuery.data.replace('tpl_', '');
      await editTplQuery.answerCallbackQuery("Template updated!").catch(() => {});
    } else if (action === 'edit_color') {
      await ctx.reply("🎨 Select a Color Palette:", { reply_markup: colorKeyboard });
      const editColorQuery = await conversation.waitForCallbackQuery(/^color_/);
      data.colors = editColorQuery.callbackQuery.data.replace('color_', '');
      await editColorQuery.answerCallbackQuery("Palette updated!").catch(() => {});
    }
  } catch (err) {
    console.error('[MuluCreatives] Card Wizard Error:', err);
    await ctx.reply('❌ An error occurred. Please try again with /card or return to /start').catch(() => {});
  }
}

module.exports = { cardWizard };
