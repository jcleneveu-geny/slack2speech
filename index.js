(function () {

    var Slack = require('slack-client');
    var say = require('say');
    var config = require('./config');

    var autoReconnect = true;
    var autoMark = true;
    var slack = new Slack(config.token, autoReconnect, autoMark);

    var shouldMessageBeRead = function (username, channel) {
        return channel != null && (!config.channels.length || config.channels.indexOf(channel) > -1)
            && username != null && (!config.users.length || config.users.indexOf(username) > -1);
    };

    slack.on('open', function () {
        var channel, group, id;
        var channels = (function () {
            var ref, results;
            ref = slack.channels;
            results = [];
            for (id in ref) {
                channel = ref[id];
                if (channel.is_member) {
                    results.push("#" + channel.name);
                }
            }
            return results;
        })();
        var groups = (function () {
            var ref, results;
            ref = slack.groups;
            results = [];
            for (id in ref) {
                group = ref[id];
                if (group.is_open && !group.is_archived) {
                    results.push(group.name);
                }
            }
            return results;
        })();
        console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);
        console.log('Connected to: ' + channels.join(', ') + groups.join(', '));
        console.log('Allowed users: ' + ((config.users.length > 0) ? config.users.join(', ') : 'all'));
        return console.log("Allowed channels: " + ((config.channels.length > 0) ? config.channels.join(', ') : 'all'));
    });

    slack.on('message', function (message) {
        var channel = slack.getChannelGroupOrDMByID(message.channel);
        var user = slack.getUserByID(message.user);
        var type = message.type, text = message.text;
        var channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '@';
        channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
        var userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
        if (type === 'message' && (text != null) && shouldMessageBeRead(userName, channelName)) {
            var result = ((config.sayWhoSpeaks) ? 'From ' + user.name + ': ' : '') + config.prefix + ' ' + text;
            console.log("Announce on " + channelName + ": \"" + result + "\"");
            return say.speak(null, result);
        } else {
            if (!shouldMessageBeRead(userName, channelName)) return;
            var typeError = type !== 'message' ? "unexpected type " + type + "." : null;
            var textError = text == null ? 'text was undefined.' : null;
            var channelError = channel == null ? 'channel was undefined.' : null;
            var errors = [typeError, textError, channelError].filter(function (element) {
                return element !== null;
            }).join(' ');
            return console.log("@" + slack.self.name + " could not respond. " + errors);
        }
    });

    slack.on('error', function (error) {
        return console.error("Error: " + error);
    });

    slack.login();

}).call(this);
