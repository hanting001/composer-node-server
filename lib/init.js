const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const businessNetwork = require('./businessNetwork');
const config = require('config');
const cache = require('@huibao/cachehelper');

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    allowHeaders: ['token', 'authorization'],
    origins: ['*']
});

module.exports = (server) => {
    server.pre(cors.preflight);
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.queryParser());
    
    // server.on('after', restify.plugins.auditLogger({
    //     log: bunyan.createLogger({
    //         name: 'audit',
    //         stream: process.stdout
    //     }),
    //     printLog: true,
    //     event: 'after'
    // }));
    server.use(cors.actual);
    // server.use(conf.middleware());
    server.on('restifyError', function(req, res, err, next) {
        if(err.name === 'UnauthorizedError') {
            return res.send({
                err: {
                    code: '401',
                    message: err.message
                }
            });
        }
        return next();
    });
    businessNetwork.init();
    // db.init(conf.get('databaseConfig'));
    cache.config(config.get('cacheConfig'));
    // secret.init(conf.get('pass'));
}