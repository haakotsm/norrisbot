/**
 * Created by hakon.smorvik on 20.06.2017.
 */
'use strict';
let NorrisBot = require('../lib/norrisbot');

let token = process.env.BOT_API_KEY;
let dbPath = process.env.BOT_DB_PATH;
let name = process.env.BOT_NAME;

let norrisbot = new NorrisBot({
    token: token,
    dbPath: dbPath,
    name: name || 'norrisbot'
});

norrisbot.run();
