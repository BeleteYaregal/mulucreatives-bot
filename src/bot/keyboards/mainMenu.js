const { InlineKeyboard } = require('grammy');

/**
 * Commercial Main Menu Keyboard for MuluCreatives
 */
function getMainMenuKeyboard() {
  return new InlineKeyboard()
    .text("🪪 Business Card", "menu_card")
    .text("🎯 Logo Design", "menu_logo").row()
    .text("📱 Social Media Design", "menu_social")
    .text("📢 Flyer & Poster", "menu_flyer").row()
    .text("🎬 YouTube Thumbnail", "menu_yt")
    .text("🖼️ Banner Design", "menu_banner").row()
    .text("📄 CV / Resume", "menu_cv")
    .text("🎓 Certificate", "menu_cert").row()
    .text("💌 Invitation Card", "menu_invite")
    .text("🍔 Menu Design", "menu_food").row()
    .text("🏢 Company Profile", "menu_company")
    .text("🏠 Real Estate Ad", "menu_realestate").row()
    .text("━━━━━━━━━━━━━━━━━━━━━━", "ignore").row()
    .text("📸 Photo Editing", "menu_photo")
    .text("🤖 AI Image Design", "menu_ai").row()
    .text("📦 My Orders", "menu_orders")
    .text("👤 My Profile", "menu_profile").row()
    .text("💬 Contact Support", "menu_support");
}

module.exports = { getMainMenuKeyboard };
