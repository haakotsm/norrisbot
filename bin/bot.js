/**
 * Created by hakon.smorvik on 20.06.2017.
 */
'use strict';
let SverreBot = require('../lib/sverrebot');

let token = process.env.BOT_API_KEY;
let dbPath = process.env.BOT_DB_PATH;
let name = process.env.BOT_NAME;

let sverrebot = new SverreBot({
    token: token,
    dbPath: dbPath,
    name: name || 'norrisbot'
});

sverrebot.run();