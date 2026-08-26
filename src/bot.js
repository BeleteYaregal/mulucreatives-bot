require('dotenv').config();
const http = require('http');
const { Bot, InputFile, InlineKeyboard } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { getSessionConfig } = require('./middleware/session');
const { cardWizard } = require('./conversations/cardWizard');
const { logoWizard } = require('./conversations/logoWizard');
const { photoWizard } = require('./conversations/photoWizard');
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

const rawToken = process.env.BOT_TOKEN || '';
const token = rawToken.trim().replace(/^["']|["']$/g, '');
if (!token) {
  console.error("❌ ERROR: BOT_TOKEN is missing or empty!");
  process.exit(1);
}

const bot = new Bot(token);

bot.use(getSessionConfig());
bot.use(conversations());
bot.use(createConversation(cardWizard));
bot.use(createConversation(logoWizard));
bot.use(createConversation(photoWizard));

const welcomeMsg = `✨ <b>Welcome to MuluCreatives!</b>
━━━━━━━━━━━━━━━━━━━━━━
Your Commercial Graphics Design Studio inside Telegram 🎨
Create professional, print-ready designs in seconds!

<b>🛠️ Available Services:</b>
• 🪪 Business Card (7 Designer Templates + Print-Ready PDF)
• 🎯 Logo Design (6 Presets + Vector Export)
• 📸 Photo Editing &amp; Background Removal
• 📱 Social Media Design  •  📢 Flyers &amp; Posters
• 🎬 YouTube Thumbnails  •  🖼️ Banners
• 📄 CV / Resume  •  🎓 Certificates
• 💌 Invitations  •  🍔 Restaurant Menus
• 🏢 Company Profiles  •  🏠 Real Estate Ads
• 🤖 AI Image Design

<i>Tap a service below to start:</i> 👇`;

bot.command("start", async (ctx) => {
  db.saveUser({ id: ctx.from.id, firstName: ctx.from.first_name, lastName: ctx.from.last_name, username: ctx.from.username });
  await ctx.reply(welcomeMsg, { parse_mode: 'HTML', reply_markup: getMainMenuKeyboard() });
  notifyAdminNewUser(ctx.api, ctx);
});

bot.command("admin", handleAdminCommand);

bot.command("help", async (ctx) => {
  await ctx.reply(
    `ℹ️ <b>MuluCreatives — Commercial Help &amp; Support</b>
━━━━━━━━━━━━━━━━━━━━━━
/start — Main service menu
/card — Create a business card (7 styles + PDF)
/logo — Generate a logo
/photo — Edit photo / Remove background
/orders — View my recent orders
/admin — Admin panel (authorized users)
/help — Show this message

💬 Need custom design work? Contact @MuluCreativesbot`,
    { parse_mode: 'HTML' }
  );
});

bot.command("card", async (ctx) => {
  await ctx.conversation.enter("cardWizard");
});

bot.command("logo", async (ctx) => {
  await ctx.conversation.enter("logoWizard");
});

bot.command("photo", async (ctx) => {
  await ctx.conversation.enter("photoWizard");
});

bot.command("orders", async (ctx) => {
  const userOrders = db.getUserOrders(ctx.from.id);
  if (!userOrders || userOrders.length === 0) {
    return ctx.reply("📦 <b>My Orders</b>\n\nYou haven't placed any design orders yet! Use /card or /logo to get started.", { parse_mode: 'HTML' });
  }

  const list = userOrders.map((o, idx) => `${idx + 1}. Order <code>#${o.id.slice(0, 8)}</code> — <b>${o.status}</b> (${o.price}) — <i>${new Date(o.createdAt).toLocaleDateString()}</i>`).join('\n');
  await ctx.reply(`📦 <b>My Recent Orders:</b>\n━━━━━━━━━━━━━━━━━━━━━━\n${list}`, { parse_mode: 'HTML' });
});

bot.callbackQuery("menu_card", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.conversation.enter("cardWizard");
});

bot.callbackQuery("menu_logo", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.conversation.enter("logoWizard");
});

bot.callbackQuery("menu_photo", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.conversation.enter("photoWizard");
});

bot.callbackQuery("menu_orders", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const userOrders = db.getUserOrders(ctx.from.id);
  if (!userOrders || userOrders.length === 0) {
    return ctx.reply("📦 <b>My Orders</b>\n\nYou haven't placed any design orders yet! Use /card or /logo to get started.", { parse_mode: 'HTML' });
  }
  const list = userOrders.map((o, idx) => `${idx + 1}. Order <code>#${o.id.slice(0, 8)}</code> — <b>${o.status}</b> (${o.price}) — <i>${new Date(o.createdAt).toLocaleDateString()}</i>`).join('\n');
  await ctx.reply(`📦 <b>My Recent Orders:</b>\n━━━━━━━━━━━━━━━━━━━━━━\n${list}`, { parse_mode: 'HTML' });
});

bot.callbackQuery("menu_profile", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const userCards = db.getUserCards(ctx.from.id);
  const userOrders = db.getUserOrders(ctx.from.id);
  const msg = `👤 <b>My Profile</b>\n━━━━━━━━━━━━━━━━━━━━━━\nName: ${ctx.from.first_name} ${ctx.from.last_name || ''}\nUsername: @${ctx.from.username || 'N/A'}\nUser ID: <code>${ctx.from.id}</code> \n\n🪪 Cards Generated: ${userCards.length}\n📦 Total Orders: ${userOrders.length}`;
  await ctx.reply(msg, { parse_mode: 'HTML' });
});

bot.callbackQuery("menu_support", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply("💬 <b>Customer Support</b>\n━━━━━━━━━━━━━━━━━━━━━━\nFor custom graphics design, special printing requests, or business inquiries, contact our team:\n\n📱 Telegram: @MuluCreativesbot\n📧 Email: support@mulucreatives.com", { parse_mode: 'HTML' });
});

bot.callbackQuery("back_menu", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply(welcomeMsg, { parse_mode: 'HTML', reply_markup: getMainMenuKeyboard() });
});

bot.callbackQuery(/menu_.+/, async (ctx) => {
  if (['menu_card', 'menu_logo', 'menu_photo', 'menu_orders', 'menu_profile', 'menu_support'].includes(ctx.callbackQuery.data)) return;
  await ctx.answerCallbackQuery("🚧 Coming soon!").catch(() => {});
  await ctx.reply(
    `🚧 <b>Service Coming Soon!</b>\n\nThis graphics service module is currently under development for Ethiopian customers.\nStay tuned for updates! ✨`,
    { parse_mode: 'HTML' }
  );
});

bot.callbackQuery("admin_refresh", handleAdminCommand);

bot.callbackQuery("admin_orders", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const orders = db.getAllOrders();
  const msg = `📦 <b>All System Orders (${orders.length}):</b>\n━━━━━━━━━━━━━━━━━━━━━━\n${orders.slice(-10).map(o => `• Order <code>#${o.id.slice(0, 8)}</code> | User: <code>${o.userId}</code> | Status: <b>${o.status}</b>`).join('\n') || '<i>No orders</i>'}`;
  await ctx.reply(msg, { parse_mode: 'HTML' });
});

bot.callbackQuery("ignore", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
});

bot.catch((err) => {
  console.error(`[MuluCreatives System Error] Update ${err.ctx.update.update_id}:`, err.error);
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.api.deleteWebhook({ drop_pending_updates: true }).catch(() => {}).then(() => {
  bot.start({ drop_pending_updates: true });
  console.log('✨ Commercial MuluCreatives Platform is running! @MuluCreativesbot');
});
