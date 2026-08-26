/**
 * Admin Notification Utility for MuluCreatives Bot
 * Sends notifications to the admin when designs are generated
 */

function escapeMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/[_*`\[\]]/g, '\\$&');
}

/**
 * Send a notification to the admin
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
  const username = user.username ? `@${escapeMarkdown(user.username)}` : 'No username';
  const fullName = escapeMarkdown([user.first_name, user.last_name].filter(Boolean).join(' '));
  const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  const message = `📊 *MuluCreatives — New Design Generated*
━━━━━━━━━━━━━━━━━━━━━━
🎨 *Type:* ${escapeMarkdown(type)}
👤 *Customer:* ${fullName}
🔗 *Username:* ${username}
🆔 *User ID:* \`${user.id}\`
🕐 *Time:* ${escapeMarkdown(now)}
${details ? `\n📋 *Details:*\n${escapeMarkdown(details)}` : ''}
━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    if (imageBuffer) {
      const { InputFile } = require('grammy');
      await api.sendPhoto(adminId, new InputFile(imageBuffer, 'preview.png'), {
        caption: message,
        parse_mode: 'Markdown',
      });
    } else {
      await api.sendMessage(adminId, message, { parse_mode: 'Markdown' });
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
  const username = user.username ? `@${escapeMarkdown(user.username)}` : 'No username';
  const fullName = escapeMarkdown([user.first_name, user.last_name].filter(Boolean).join(' '));
  const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  const message = `👋 *MuluCreatives — New User*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${fullName}
🔗 *Username:* ${username}
🆔 *User ID:* \`${user.id}\`
🕐 *Time:* ${escapeMarkdown(now)}
━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    await api.sendMessage(adminId, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Failed to notify admin (new user):', err.message);
  }
}

module.exports = { notifyAdmin, notifyAdminNewUser };
