/**
 * Created by hakon.smorvik on 20.06.2017.
 */
'use strict';

let util = require('util');
let fs = require('fs');
let path = require('path');
let SQLite = require('sqlite3');
let Bot = require('slackbots');

class SverreBot extends Bot {
    constructor(settings) {
        super(settings);
        this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'norrisbot.db');
        this.user = null;
    }
}

module.exports = SverreBot;

SverreBot.prototype.run = function () {
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

SverreBot.prototype._onStart = function () {
    this._loadBotUser();
    this._connectDb();
    this._firstRunCheck();
};

SverreBot.prototype._loadBotUser = function () {
    let self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

SverreBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exist or it\'s not readable.');
        process.exit(1);
    }
    this.db = new SQLite.Database(this.dbPath);
};

SverreBot.prototype._firstRunCheck = function () {
    let self = this;
    self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
        if (err) return console.error('DATABASE ERROR:', err);

        let currentTime = (new Date()).toJSON();

        if (!record) {
            self._welcomeMessage();
            return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
        }

        self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
    });
};

SverreBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel('sverrebotspam', 'Hei alle sammen! Nå kommer det vitser på rekke og rad! ' +
        '\nBare skriv `Sverre Hurum` eller `' + this.name + '` for å sette i gang!', {as_user: true}, null);
};

SverreBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromSverreBot(message) &&
        this._isMentioningSverre(message)) {
        this._replyWithRandomJoke(message);
    }
};

SverreBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

SverreBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' && message.channel[0] === 'C';
};

SverreBot.prototype._isFromSverreBot = function (message) {
    return message.user === this.user.id;
};

SverreBot.prototype._isMentioningSverre = function (message) {

    return message.text.toLowerCase().includes('sverre') ||
        message.text.toLowerCase().includes('hurum') ||
        message.text.toLowerCase().includes(this.name);
};

SverreBot.prototype._replyWithRandomJoke = function (originalMessage) {
    let self = this;
    self.db.get('SELECT id, joke FROM jokes ORDER BY used ASC, RANDOM() LIMIT 1', function (err, record) {
        if (err) return console.error('DATABASE ERROR:', err);
        let channel = self._getChannelById(originalMessage.channel);
        let message = record.joke;
        console.log(message);
        while (message.includes('Chuck Norris')){
            console.log('jeg kjører veldig mange ganger: ', message);
            message.replace('Chuck Norris', 'Sverre Hurum');
        }
        console.log('denne er ikke uendelig');
        while (message.includes('Sverre Hurum\'')) message.replace('Sverre Hurum\'', 'Sverre Hurums');
        console.log('denne er heller ikke uendelig');
        self.postMessageToChannel(channel.name, message, {as_user: true}, null);
        self.db.run('UPDATE jokes SET used = used + 1 WHERE id = ?', record.id);
    });
};

SverreBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};