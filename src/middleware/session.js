const fs = require('fs');
const path = require('path');
const { session } = require('grammy');

const sessionFile = path.resolve(__dirname, '../../storage/sessions.json');

function loadSessions() {
  try {
    if (fs.existsSync(sessionFile)) {
      return JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    }
  } catch (e) {
    console.error('[MuluCreatives] Error loading sessions:', e);
  }
  return {};
}

function saveSessions(sessions) {
  try {
    const dir = path.dirname(sessionFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(sessionFile, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (e) {
    console.error('[MuluCreatives] Error saving sessions:', e);
  }
}

const fileStorage = {
  async read(key) {
    const sessions = loadSessions();
    return sessions[key];
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
    storage: fileStorage
  });
}

module.exports = { getSessionConfig };
