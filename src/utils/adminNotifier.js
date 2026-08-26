/**
 * Admin Notification Utility for MuluCreatives Bot
 * Sends notifications to the admin when designs are generated or new users join
 */

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Send a notification to the admin when a design is created
 * @param {import('grammy').Api} api - The bot API instance
 * @param {string} type - Design type (e.g., 'Business Card', 'Logo')
 * @param {string} details - Details about the generation
 * @param {import('grammy').Context} userCtx - The user context
 * @param {Buffer} [imageBuffer] - Optional image buffer to send as preview
 */
async function notifyAdmin(api, type, details, userCtx, imageBuffer = null) {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId) return;

  const user = userCtx.from;
  const username = user.username ? `@${escapeHtml(user.username)}` : 'No username';
  const fullName = escapeHtml([user.first_name, user.last_name].filter(Boolean).join(' '));
  const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  const message = `📊 <b>MuluCreatives — New Design Generated</b>
━━━━━━━━━━━━━━━━━━━━━━
🎨 <b>Type:</b> ${escapeHtml(type)}
👤 <b>Customer:</b> ${fullName}
🔗 <b>Username:</b> ${username}
🆔 <b>User ID:</b> <code>${user.id}</code>
🕐 <b>Time:</b> ${escapeHtml(now)}
${details ? `\n📋 <b>Details:</b>\n${escapeHtml(details)}` : ''}
━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    if (imageBuffer) {
      const { InputFile } = require('grammy');
      await api.sendPhoto(adminId, new InputFile(imageBuffer, 'preview.png'), {
        caption: message,
        parse_mode: 'HTML',
      });
    } else {
      await api.sendMessage(adminId, message, { parse_mode: 'HTML' });
    }
  } catch (err) {
    console.error('Failed to notify admin:', err.message);
  }
}

/**
 * Notify admin about a new user starting the bot
 * @param {import('grammy').Api} api
 * @param {import('grammy').Context} ctx
 */
async function notifyAdminNewUser(api, ctx) {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId) return;

  const user = ctx.from;
  const username = user.username ? `@${escapeHtml(user.username)}` : 'No username';
  const fullName = escapeHtml([user.first_name, user.last_name].filter(Boolean).join(' '));
  const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  const message = `🎉 <b>MuluCreatives — New User Joined!</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${fullName}
🔗 <b>Username:</b> ${username}
🆔 <b>User ID:</b> <code>${user.id}</code>
🕐 <b>Time:</b> ${escapeHtml(now)}
━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    await api.sendMessage(adminId, message, { parse_mode: 'HTML' });
  } catch (err) {
    console.error('Failed to notify admin (new user):', err.message);
  }
}

module.exports = { notifyAdmin, notifyAdminNewUser };
