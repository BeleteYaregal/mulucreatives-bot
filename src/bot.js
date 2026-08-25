require('dotenv').config();
const { Bot, InputFile, InlineKeyboard } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { getSessionConfig } = require('./middleware/session');
const { cardWizard } = require('./conversations/cardWizard');
const { logoWizard } = require('./conversations/logoWizard');
const { notifyAdminNewUser } = require('./utils/adminNotifier');

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(getSessionConfig());
bot.use(conversations());
bot.use(createConversation(cardWizard));
bot.use(createConversation(logoWizard));

const mainMenuKeyboard = new InlineKeyboard()
  .text("🪪 Business Card", "menu_card").text("🏷️ Logo Design", "menu_logo").row()
  .text("📱 Social Media", "menu_social").text("📢 Flyer & Poster", "menu_flyer").row()
  .text("🎬 YouTube Thumb", "menu_yt").text("🖼️ Banner", "menu_banner").row()
  .text("📄 CV / Resume", "menu_cv").text("🎓 Certificate", "menu_cert").row()
  .text("💍 Invitation", "menu_invite").text("🍔 Menu", "menu_food").row()
  .text("🏢 Company Profile", "menu_company").text("🏠 Real Estate", "menu_realestate").row()
  .text("━━━━━━━━━━━━━━━━━━━━━━", "ignore").row()
  .text("📸 Photo Editing", "menu_photo").text("🤖 AI Design", "menu_ai").row()
  .text("✨ Custom Design", "menu_custom");

const welcomeMsg = `✨ *Welcome to MuluCreatives!*
━━━━━━━━━━━━━━━━━━━━━━
Your professional design partner 🎨
Create stunning designs in seconds!

*🛠️ Our Services:*

🪪 Business Card  •  🏷️ Logo Design
📱 Social Media  •  📢 Flyers & Posters
🎬 YouTube Thumbnails  •  🖼️ Banners
📄 CV / Resume  •  🎓 Certificates
💍 Invitations  •  🍔 Restaurant Menus
🏢 Company Profiles  •  🏠 Real Estate Ads
📸 Photo Editing  •  🤖 AI Design

_Tap a button below to get started!_ 👇`;

bot.command("start", async (ctx) => {
  await ctx.reply(welcomeMsg, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard });
  // Notify admin of new user
  notifyAdminNewUser(ctx.api, ctx);
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    `ℹ️ *MuluCreatives — Help*
━━━━━━━━━━━━━━━━━━━━━━
/start — Main menu
/card — Create a business card
/logo — Design a logo
/help — Show this message

💬 Need help? Contact @MuluCreativesbot`,
    { parse_mode: 'Markdown' }
  );
});

bot.command("card", async (ctx) => {
  await ctx.conversation.enter("cardWizard");
});

bot.command("logo", async (ctx) => {
  await ctx.conversation.enter("logoWizard");
});

bot.callbackQuery("menu_card", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("cardWizard");
});

bot.callbackQuery("menu_logo", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("logoWizard");
});

bot.callbackQuery("back_menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(welcomeMsg, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard });
});

bot.callbackQuery(/menu_.+/, async (ctx) => {
  if (['menu_card', 'menu_logo'].includes(ctx.callbackQuery.data)) return;
  await ctx.answerCallbackQuery("🚧 Coming soon!");
  await ctx.reply(
    `🚧 *Coming Soon!*\n\nThis feature is under development at MuluCreatives.\nStay tuned for updates! ✨`,
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery("ignore", async (ctx) => {
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("mockup_logo", async (ctx) => {
  await ctx.answerCallbackQuery("🚧 Coming soon!");
  await ctx.reply("🚧 Mockup generator coming soon! Stay tuned ✨");
});

bot.catch((err) => {
  console.error(`[MuluCreatives] Error in update ${err.ctx.update.update_id}:`);
  console.error(err.error);
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.start();
console.log('✨ MuluCreatives Bot is running! @MuluCreativesbot');
