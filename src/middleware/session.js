const { session } = require('grammy');

/**
 * Pure in-memory session storage.
 *
 * Why NOT file-based on Render:
 *  - Render containers are ephemeral — the filesystem is wiped on every deploy/restart.
 *  - File writes under concurrent polling cause JSON corruption (race condition).
 *  - Grammy Conversations v2 replays the ENTIRE conversation from session data on
 *    every update. Corrupted/missing session = silent freeze on button clicks.
 *
 * In-memory is perfectly fine for a Telegram bot:
 *  - Sessions are per-chat and short-lived (one wizard flow).
 *  - If the bot restarts mid-flow the user just starts over (expected behavior).
 */
const memoryStore = new Map();

const memoryStorage = {
  async read(key) {
    return memoryStore.get(key) ?? undefined;
  },
  async write(key, value) {
    memoryStore.set(key, value);
  },
  async delete(key) {
    memoryStore.delete(key);
  }
};

function getSessionConfig() {
  return session({
    initial: () => ({
      lastLogo: null,
      lastDesign: null,
      conversationData: {},
    }),
    storage: memoryStorage,
    // CRITICAL: scope session per chat-id so Grammy Conversations can find
    // the right conversation state for each user.
    getSessionKey: (ctx) => ctx.chat?.id?.toString() ?? undefined,
  });
}

module.exports = { getSessionConfig };
