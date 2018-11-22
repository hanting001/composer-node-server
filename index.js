"use strict";
const restify = require('restify');
const init = require('./lib/init');
const server = restify.createServer();


const router = require('./router');
init(server);
//配置路由
router(server);

server.listen(7000, function () {
    console.log('%s listening at %s', server.name, server.url);
});