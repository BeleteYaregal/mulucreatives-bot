const { session } = require('grammy');

function getSessionConfig() {
  return session({
    initial: () => ({
      lastLogo: null,       // Buffer of last generated logo
      lastDesign: null,     // Buffer of last generated design
      conversationData: {}, // Temp data during conversations
    }),
  });
}

module.exports = { getSessionConfig };
