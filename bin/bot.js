/**
 * Created by hakon.smorvik on 20.06.2017.
 */
'use strict';

var SverreBot = require('../lib/sverrebot');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var sverrebot = new SverreBot({
    token: token,
    dbPath: dbPath,
    name: name
});

sverrebot.run();