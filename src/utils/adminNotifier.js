/**
 * Admin Notification Utility for MuluCreatives Bot
 * Sends notifications to the admin when designs are generated
 */

/**
 * Send a notification to the admin
 * @param {import('grammy').Api} api - The bot API instance
 * @param {string} type - Design type (e.g., 'Business Card', 'Logo')
 * @param {Object} details - Details about the generation
 * @param {import('grammy').Context} userCtx - The user context
 * @param {Buffer} [imageBuffer] - Optional image buffer to send as preview
 */
async function notifyAdmin(api, type, details, userCtx, imageBuffer = null) {
  const adminId = process.env.ADMIN_CHAT_ID;
  if (!adminId) return; // Skip if no admin configured

  const user = userCtx.from;
  const username = user.username ? `@${user.username}` : 'No username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  const message = `📊 *MuluCreatives — New Design Generated*
━━━━━━━━━━━━━━━━━━━━━━
🎨 *Type:* ${type}
👤 *Customer:* ${fullName}
🔗 *Username:* ${username}
🆔 *User ID:* \`${user.id}\`
🕐 *Time:* ${now}
${details ? `\n📋 *Details:*\n${details}` : ''}
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
  const username = user.username ? `@${user.username}` : 'No username';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  const message = `👋 *MuluCreatives — New User*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${fullName}
🔗 *Username:* ${username}
🆔 *User ID:* \`${user.id}\`
🕐 *Time:* ${now}
━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    await api.sendMessage(adminId, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Failed to notify admin (new user):', err.message);
  }
}

module.exports = { notifyAdmin, notifyAdminNewUser };
