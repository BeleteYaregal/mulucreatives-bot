require('dotenv').config();
const http = require('http');
const { Bot, InputFile, InlineKeyboard } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { getSessionConfig } = require('./middleware/session');
const { cardWizard } = require('./conversations/cardWizard');
const { logoWizard } = require('./conversations/logoWizard');
const { notifyAdminNewUser } = require('./utils/adminNotifier');
const { initStorage } = require('./utils/storage');
const { db } = require('./database/db');
const { getMainMenuKeyboard } = require('./bot/keyboards/mainMenu');
const { handleAdminCommand } = require('./bot/handlers/adminHandler');

// 1. Initialize Storage Directories
initStorage();

// 2. Start HTTP Health Check Server for Render Web Services
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✨ MuluCreatives Bot is active!\n');
}).listen(port, () => {
  console.log(`🌐 Health check server listening on port ${port}`);
});

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(getSessionConfig());
bot.use(conversations());
bot.use(createConversation(cardWizard));
bot.use(createConversation(logoWizard));

const welcomeMsg = `✨ *Welcome to MuluCreatives!*
━━━━━━━━━━━━━━━━━━━━━━
Your Commercial Graphics Design Studio inside Telegram 🎨
Create professional, print-ready designs in seconds!

*🛠️ Available Services:*
• 🪪 Business Card (7 Designer Templates + Print-Ready PDF)
• 🎯 Logo Design (6 Presets + Vector Export)
• 📱 Social Media Design  •  📢 Flyers & Posters
• 🎬 YouTube Thumbnails  •  🖼️ Banners
• 📄 CV / Resume  •  🎓 Certificates
• 💌 Invitations  •  🍔 Restaurant Menus
• 🏢 Company Profiles  •  🏠 Real Estate Ads
• 📸 Photo Editing  •  🤖 AI Image Design

_Tap a service below to start:_ 👇`;

bot.command("start", async (ctx) => {
  db.saveUser({ id: ctx.from.id, firstName: ctx.from.first_name, lastName: ctx.from.last_name, username: ctx.from.username });
  await ctx.reply(welcomeMsg, { parse_mode: 'Markdown', reply_markup: getMainMenuKeyboard() });
  notifyAdminNewUser(ctx.api, ctx);
});

bot.command("admin", handleAdminCommand);

bot.command("help", async (ctx) => {
  await ctx.reply(
    `ℹ️ *MuluCreatives — Commercial Help & Support*
━━━━━━━━━━━━━━━━━━━━━━
/start — Main service menu
/card — Create a business card (7 styles + PDF)
/logo — Generate a logo
/orders — View my recent orders
/admin — Admin panel (authorized users)
/help — Show this message

💬 Need custom design work? Contact @MuluCreativesbot`,
    { parse_mode: 'Markdown' }
  );
});

bot.command("card", async (ctx) => {
  await ctx.conversation.enter("cardWizard");
});

bot.command("logo", async (ctx) => {
  await ctx.conversation.enter("logoWizard");
});

bot.command("orders", async (ctx) => {
  const userOrders = db.getUserOrders(ctx.from.id);
  if (!userOrders || userOrders.length === 0) {
    return ctx.reply("📦 *My Orders*\n\nYou haven't placed any design orders yet! Use /card or /logo to get started.", { parse_mode: 'Markdown' });
  }

  const list = userOrders.map((o, idx) => `${idx + 1}. Order \`#${o.id.slice(0, 8)}\` — *${o.status}* (${o.price}) — _${new Date(o.createdAt).toLocaleDateString()}_`).join('\n');
  await ctx.reply(`📦 *My Recent Orders:*\n━━━━━━━━━━━━━━━━━━━━━━\n${list}`, { parse_mode: 'Markdown' });
});

bot.callbackQuery("menu_card", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("cardWizard");
});

bot.callbackQuery("menu_logo", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("logoWizard");
});

bot.callbackQuery("menu_orders", async (ctx) => {
  await ctx.answerCallbackQuery();
  const userOrders = db.getUserOrders(ctx.from.id);
  if (!userOrders || userOrders.length === 0) {
    return ctx.reply("📦 *My Orders*\n\nYou haven't placed any design orders yet! Use /card or /logo to get started.", { parse_mode: 'Markdown' });
  }
  const list = userOrders.map((o, idx) => `${idx + 1}. Order \`#${o.id.slice(0, 8)}\` — *${o.status}* (${o.price}) — _${new Date(o.createdAt).toLocaleDateString()}_`).join('\n');
  await ctx.reply(`📦 *My Recent Orders:*\n━━━━━━━━━━━━━━━━━━━━━━\n${list}`, { parse_mode: 'Markdown' });
});

bot.callbackQuery("menu_profile", async (ctx) => {
  await ctx.answerCallbackQuery();
  const userCards = db.getUserCards(ctx.from.id);
  const userOrders = db.getUserOrders(ctx.from.id);
  const msg = `👤 *My Profile*\n━━━━━━━━━━━━━━━━━━━━━━\nName: ${ctx.from.first_name} ${ctx.from.last_name || ''}\nUsername: @${ctx.from.username || 'N/A'}\nUser ID: \`${ctx.from.id}\` \n\n🪪 Cards Generated: ${userCards.length}\n📦 Total Orders: ${userOrders.length}`;
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

bot.callbackQuery("menu_support", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("💬 *Customer Support*\n━━━━━━━━━━━━━━━━━━━━━━\nFor custom graphics design, special printing requests, or business inquiries, contact our team:\n\n📱 Telegram: @MuluCreativesbot\n📧 Email: support@mulucreatives.com", { parse_mode: 'Markdown' });
});

bot.callbackQuery("back_menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(welcomeMsg, { parse_mode: 'Markdown', reply_markup: getMainMenuKeyboard() });
});

bot.callbackQuery(/menu_.+/, async (ctx) => {
  if (['menu_card', 'menu_logo', 'menu_orders', 'menu_profile', 'menu_support'].includes(ctx.callbackQuery.data)) return;
  await ctx.answerCallbackQuery("🚧 Coming soon!");
  await ctx.reply(
    `🚧 *Service Coming Soon!*\n\nThis graphics service module is currently under development for Ethiopian customers.\nStay tuned for updates! ✨`,
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery("admin_refresh", handleAdminCommand);

bot.callbackQuery("admin_orders", async (ctx) => {
  await ctx.answerCallbackQuery();
  const orders = db.getAllOrders();
  const msg = `📦 *All System Orders (${orders.length}):*\n━━━━━━━━━━━━━━━━━━━━━━\n${orders.slice(-10).map(o => `• Order \`#${o.id.slice(0, 8)}\` | User: \`${o.userId}\` | Status: *${o.status}*`).join('\n') || '_No orders_'}`;
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

bot.callbackQuery("ignore", async (ctx) => {
  await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  console.error(`[MuluCreatives System Error] Update ${err.ctx.update.update_id}:`, err.error);
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.start();
console.log('✨ Commercial MuluCreatives Platform is running! @MuluCreativesbot');
