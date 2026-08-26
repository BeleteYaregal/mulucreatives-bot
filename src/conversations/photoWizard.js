const { InlineKeyboard, InputFile } = require('grammy');
const sharp = require('sharp');
const { notifyAdmin } = require('../utils/adminNotifier');

async function downloadFile(ctx, fileId) {
  const file = await ctx.api.getFile(fileId);
  const url = `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`;
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Perform background removal / transparency processing using sharp
 */
async function processBackgroundRemoval(inputBuffer) {
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  // Convert to RGBA raw pixel array
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = Buffer.from(data);

  // Sample corner pixel color (top-left background reference)
  const bgR = pixelData[0];
  const bgG = pixelData[1];
  const bgB = pixelData[2];

  // Alpha thresholding for background removal
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
    if (diff < 65) {
      pixelData[i + 3] = 0; // Make transparent
    }
  }

  // Reconstruct sharp PNG buffer
  return await sharp(pixelData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();
}

/**
 * Resize image for social media platform preset
 */
async function resizeForPlatform(inputBuffer, width, height) {
  return await sharp(inputBuffer)
    .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
}

async function photoWizard(conversation, ctx) {
  await ctx.reply("📸 <b>Upload the photo or image you want to edit:</b>", { parse_mode: 'HTML' });

  const photoCtx = await conversation.waitFor('message:photo');
  const photo = photoCtx.message.photo[photoCtx.message.photo.length - 1];

  await ctx.reply("⏳ Downloading your image...", { parse_mode: 'HTML' });
  const inputBuffer = await conversation.external(() => downloadFile(ctx, photo.file_id));

  const toolKeyboard = new InlineKeyboard()
    .text("✂️ Remove Background (Transparent PNG)", "tool_bg_remove").row()
    .text("📐 Resize for Instagram Post (1080×1080)", "tool_ig_post").row()
    .text("📱 Resize for Instagram Story (1080×1920)", "tool_ig_story").row()
    .text("📘 Resize for Facebook Cover (1200×630)", "tool_fb_cover").row()
    .text("🏠 Main Menu", "back_menu");

  await ctx.reply("✨ <b>Select a Photo Editing Tool:</b>", { parse_mode: 'HTML', reply_markup: toolKeyboard });

  const toolQuery = await conversation.waitForCallbackQuery(/(tool_|back_menu)/);
  const action = toolQuery.callbackQuery.data;
  await toolQuery.answerCallbackQuery().catch(() => {});

  if (action === 'back_menu') {
    return ctx.reply("Returning to main menu...");
  }

  await ctx.reply("⏳ Processing image with high quality...", { parse_mode: 'HTML' });

  try {
    let resultBuffer;
    let filename = 'edited_image.png';

    if (action === 'tool_bg_remove') {
      resultBuffer = await conversation.external(() => processBackgroundRemoval(inputBuffer));
      filename = 'Background_Removed_Transparent.png';
    } else if (action === 'tool_ig_post') {
      resultBuffer = await conversation.external(() => resizeForPlatform(inputBuffer, 1080, 1080));
      filename = 'Instagram_Post_1080x1080.png';
    } else if (action === 'tool_ig_story') {
      resultBuffer = await conversation.external(() => resizeForPlatform(inputBuffer, 1080, 1920));
      filename = 'Instagram_Story_1080x1920.png';
    } else if (action === 'tool_fb_cover') {
      resultBuffer = await conversation.external(() => resizeForPlatform(inputBuffer, 1200, 630));
      filename = 'Facebook_Cover_1200x630.png';
    }

    const finishKeyboard = new InlineKeyboard()
      .text("📸 Edit Another Photo", "menu_photo").row()
      .text("🏠 Main Menu", "back_menu");

    await ctx.replyWithPhoto(new InputFile(resultBuffer, filename), {
      caption: `✨ <b>Your Processed Photo is Ready!</b>\n\nTool: <code>${action.replace('tool_', '')}</code>\n\n_File attached as uncompressed PNG document below:_ 📄`,
      parse_mode: 'HTML'
    });

    await ctx.replyWithDocument(new InputFile(resultBuffer, filename), {
      caption: `📄 <b>${filename}</b> (High-Quality Uncompressed Document)`,
      reply_markup: finishKeyboard
    });

    // Notify Admin
    await conversation.external(() =>
      notifyAdmin(
        ctx.api,
        '📸 Photo Editing',
        `Tool used: ${action}`,
        ctx,
        resultBuffer
      )
    );

  } catch (error) {
    console.error("Photo processing error:", error);
    await ctx.reply("❌ Error processing photo. Please try uploading a clearer image.");
  }
}

module.exports = { photoWizard };
