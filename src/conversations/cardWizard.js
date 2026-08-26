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
    template: 'modern',
    colors: 'ocean'
  };

  // --- Step 1: Template Selection ---
  const tplKeyboard = new InlineKeyboard()
    .text("🟦 Corporate Blue", "tpl_corporate")
    .text("🔵 Abel Modern", "tpl_modern").row()
    .text("⚪ Ultra Minimal", "tpl_minimal")
    .text("⬛ Luxury Gold", "tpl_luxury").row()
    .text("🟣 Creative Bold", "tpl_creative")
    .text("🟢 Tech Hexagon", "tpl_technology").row()
    .text("🌸 Elegant Serif", "tpl_elegant");

  await ctx.reply("🎨 <b>Choose a Business Card Template Style:</b>", { parse_mode: 'HTML', reply_markup: tplKeyboard });
  const tplQuery = await conversation.waitForCallbackQuery(/tpl_/);
  data.template = tplQuery.callbackQuery.data.replace('tpl_', '');
  await tplQuery.answerCallbackQuery().catch(() => {});

  // --- Step 2: Form Collection ---
  await ctx.reply("📝 What is your <b>Full Name</b>? (e.g. Belete Yaregal)", { parse_mode: 'HTML' });
  const nameCtx = await conversation.waitFor('message:text');
  data.name = nameCtx.message.text.trim();

  await ctx.reply("💼 What is your <b>Job Title</b>? (e.g. Graphics Designer)", { parse_mode: 'HTML' });
  const titleCtx = await conversation.waitFor('message:text');
  data.title = titleCtx.message.text.trim();

  await ctx.reply("🏢 What is your <b>Company or Brand Name</b>? (e.g. Sebez Systems)", { parse_mode: 'HTML' });
  const companyCtx = await conversation.waitFor('message:text');
  data.company = companyCtx.message.text.trim();

  // Phone validation loop
  let validPhone = false;
  while (!validPhone) {
    await ctx.reply("📞 What is your <b>Phone Number</b>? (e.g. 0901135018 or +251 901 135 018)", { parse_mode: 'HTML' });
    const phoneCtx = await conversation.waitFor('message:text');
    const res = validatePhone(phoneCtx.message.text.trim());
    if (res.valid) {
      data.phone = res.formatted;
      validPhone = true;
    } else {
      await ctx.reply("⚠️ Invalid phone number format. Please enter a valid phone number (e.g., 0901135018).");
    }
  }

  // Email validation loop
  await ctx.reply("📧 What is your <b>Email Address</b>? (or send /skip)", { parse_mode: 'HTML' });
  const emailCtx = await conversation.wait();
  if (emailCtx.message?.text && emailCtx.message.text !== '/skip') {
    const res = validateEmail(emailCtx.message.text.trim());
    data.email = res.formatted;
  }

  // Telegram validation loop
  await ctx.reply("✈️ What is your <b>Telegram Handle</b>? (e.g. @beleteyaregal or /skip)", { parse_mode: 'HTML' });
  const tgCtx = await conversation.wait();
  if (tgCtx.message?.text && tgCtx.message.text !== '/skip') {
    const res = validateTelegram(tgCtx.message.text.trim());
    data.telegram = res.formatted;
  }

  // Website validation
  await ctx.reply("🌐 What is your <b>Website URL</b>? (e.g. sebezsystems.com or /skip)", { parse_mode: 'HTML' });
  const webCtx = await conversation.wait();
  if (webCtx.message?.text && webCtx.message.text !== '/skip') {
    const res = validateWebsite(webCtx.message.text.trim());
    data.website = res.formatted;
  }

  // Address
  await ctx.reply("📍 What is your <b>City/Address</b>? (e.g. Addis Ababa, Ethiopia or /skip)", { parse_mode: 'HTML' });
  const locCtx = await conversation.wait();
  if (locCtx.message?.text && locCtx.message.text !== '/skip') {
    data.location = locCtx.message.text.trim();
  }

  // Logo upload
  await ctx.reply("🏷️ Upload your <b>Company Logo</b> (image or /skip)", { parse_mode: 'HTML' });
  const logoCtx = await conversation.wait();
  if (logoCtx.message?.photo) {
    const photo = logoCtx.message.photo[logoCtx.message.photo.length - 1];
    data.logoBuffer = await conversation.external(() => downloadFile(ctx, photo.file_id));
  }

  // Color Palette Selection
  const colorKeyboard = new InlineKeyboard()
    .text("🌊 Ocean Blue", "color_ocean")
    .text("🌅 Sunset Red", "color_sunset")
    .text("🌲 Forest Green", "color_forest").row()
    .text("👑 Royal Purple", "color_royal")
    .text("🌙 Midnight Dark", "color_midnight")
    .text("🌍 Earth Brown", "color_earth");
  await ctx.reply("🎨 Select a Color Palette:", { reply_markup: colorKeyboard });
  const colorQuery = await conversation.waitForCallbackQuery(/color_/);
  data.colors = colorQuery.callbackQuery.data.replace('color_', '');
  await colorQuery.answerCallbackQuery().catch(() => {});

  // --- Step 3: Interactive Live Preview Loop ---
  let isEditing = true;

  while (isEditing) {
    await ctx.reply("⏳ Rendering live business card preview...", { parse_mode: 'HTML' });

    let cardResult;
    try {
      cardResult = await conversation.external(() => generateCard(data, data.template, data.colors));
    } catch (err) {
      console.error("Rendering error:", err);
      await ctx.reply("❌ Error rendering preview. Falling back to default styling.");
      cardResult = await conversation.external(() => generateCard(data, 'modern', 'ocean'));
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

    const captionText = `✨ <b>MuluCreatives Live Card Preview</b>\n\n👤 <b>Name:</b> ${escapeHtml(data.name)}\n💼 <b>Title:</b> ${escapeHtml(data.title)}\n🏢 <b>Company:</b> ${escapeHtml(data.company)}\n📞 <b>Phone:</b> ${escapeHtml(data.phone)}\n📧 <b>Email:</b> ${escapeHtml(data.email || 'None')}\n✈️ <b>Telegram:</b> ${escapeHtml(data.telegram || 'None')}\n🎨 <b>Template:</b> ${data.template} | <b>Theme:</b> ${data.colors}\n\n<i>Review your design or use the buttons below to edit:</i>`;

    await ctx.replyWithPhoto(new InputFile(cardResult.previewBuffer, 'Preview.png'), {
      caption: captionText,
      parse_mode: 'HTML',
      reply_markup: editKeyboard
    });

    const actionQuery = await conversation.waitForCallbackQuery(/(edit_|confirm_order|back_menu)/);
    const action = actionQuery.callbackQuery.data;
    await actionQuery.answerCallbackQuery().catch(() => {});

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
        caption: `📄 <b>Front Side</b> (300 DPI High-Resolution PNG)`
      });

      if (cardResult.backBuffer) {
        await ctx.replyWithDocument(new InputFile(cardResult.backBuffer, `${data.name.replace(/\s+/g, '_')}_Back_300DPI.png`), {
          caption: `📄 <b>Back Side</b> (300 DPI High-Resolution PNG with QR Code)`
        });
      }

      // Send Print-Ready PDF
      if (cardResult.pdfPath) {
        await ctx.replyWithDocument(new InputFile(cardResult.pdfPath, `${data.name.replace(/\s+/g, '_')}_PrintReady.pdf`), {
          caption: `🖨️ <b>Official Print-Ready Vector PDF Document</b> (Standard 3.5" x 2")`,
          reply_markup: finishKeyboard
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
      await ctx.reply("🎨 Choose a Template:", { reply_markup: tplKeyboard });
      const editTplQuery = await conversation.waitForCallbackQuery(/tpl_/);
      data.template = editTplQuery.callbackQuery.data.replace('tpl_', '');
      await editTplQuery.answerCallbackQuery().catch(() => {});
    } else if (action === 'edit_color') {
      await ctx.reply("🎨 Choose a Color Palette:", { reply_markup: colorKeyboard });
      const editColorQuery = await conversation.waitForCallbackQuery(/color_/);
      data.colors = editColorQuery.callbackQuery.data.replace('color_', '');
      await editColorQuery.answerCallbackQuery().catch(() => {});
    }
  }
}

module.exports = { cardWizard };
