const fs = require('fs');
const path = require('path');
const { session } = require('grammy');

const sessionFile = path.resolve(__dirname, '../../storage/sessions.json');

// In-memory cache to prevent race conditions on file reads/writes
let memoryCache = null;
let saveTimer = null;

function loadSessions() {
  if (memoryCache !== null) return memoryCache;
  try {
    if (fs.existsSync(sessionFile)) {
      memoryCache = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      return memoryCache;
    }
  } catch (e) {
    console.error('[Session] Error loading sessions:', e.message);
  }
  memoryCache = {};
  return memoryCache;
}

function saveSessions(sessions) {
  memoryCache = sessions;
  // Debounce writes — batch multiple rapid writes into one
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const dir = path.dirname(sessionFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(sessionFile, JSON.stringify(memoryCache, null, 2), 'utf8');
    } catch (e) {
      console.error('[Session] Error saving sessions:', e.message);
    }
  }, 200);
}

const fileStorage = {
  async read(key) {
    const sessions = loadSessions();
    return sessions[key] ?? undefined;
  },
  async write(key, value) {
    const sessions = loadSessions();
    sessions[key] = value;
    saveSessions(sessions);
  },
  async delete(key) {
    const sessions = loadSessions();
    delete sessions[key];
    saveSessions(sessions);
  }
};

function getSessionConfig() {
  return session({
    initial: () => ({
      lastLogo: null,
      lastDesign: null,
      conversationData: {},
    }),
    storage: fileStorage,
    // Explicit session key: scoped per chat (not per user+chat) for conversations to work correctly
    getSessionKey: (ctx) => ctx.chat?.id?.toString() ?? undefined,
  });
}

module.exports = { getSessionConfig };
