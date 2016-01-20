var config = {};

// your token here (see https://api.slack.com/bot-users)
config.token = 'xoxb-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// list of allowed channels. Empty means all.
// config.channels = ['#announcements', '#general', '@jc'];
config.channels = [];

// list of allowed users. Empty means all.
// config.users = ['@jc'];
config.users = [];

// Prefix that should be said before an announce
// config.prefix = 'Your attention please,';
config.prefix = '';

// Should we say who posted the message
config.sayWhoSpeaks = true;

module.exports = config;
