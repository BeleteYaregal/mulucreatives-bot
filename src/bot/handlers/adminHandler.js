const { InlineKeyboard } = require('grammy');
const { db } = require('../../database/db');

/**
 * Admin Panel Handler for MuluCreatives
 */
async function handleAdminCommand(ctx) {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId || String(ctx.from.id) !== String(adminId)) {
    return ctx.reply("⚠️ Unauthorized access.");
  }

  const stats = db.getStats ? db.getStats() : { totalUsers: 0, totalCards: 0, totalOrders: 0 };
  const allOrders = db.getAllOrders ? db.getAllOrders() : [];

  const message = `📊 *MuluCreatives — Admin Dashboard*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Total Users:* ${stats.totalUsers || 0}
🪪 *Business Cards:* ${stats.totalCards || 0}
📦 *Total Orders:* ${stats.totalOrders || 0}

*Recent Orders:*
${allOrders.slice(-5).map(o => `• Order \`#${o.id.slice(0, 8)}\` — ${o.status || 'COMPLETED'} (${o.price || 'FREE'})`).join('\n') || '_No orders yet_'}
━━━━━━━━━━━━━━━━━━━━━━`;

  const keyboard = new InlineKeyboard()
    .text("🔄 Refresh Dashboard", "admin_refresh")
    .text("📦 View All Orders", "admin_orders").row()
    .text("🏠 Main Menu", "back_menu");

  await ctx.reply(message, { parse_mode: 'Markdown', reply_markup: keyboard });
}

module.exports = { handleAdminCommand };
