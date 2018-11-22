const jwtMiddleware = require('express-jwt');
const cache = require('@huibao/cachehelper');
const bearerStrategy = function (req, payload, done) {
    let accessToken = fromHeaderOrQuerystring(req);
    cache.get('token', accessToken).then(user => {
        if (!user) {
            return done(null, true);
        }
        req.user = user;
        done(null, false);
    }).catch(err => {
        console.log(err);
        done(err);
    });
};
const fromHeaderOrQuerystring = function (req) {
    let parts = req.headers.authorization ? req.headers.authorization.split(' ') : 0;
    if (parts.length == 2) {
        let scheme = parts[0],
            credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        } else {
            return null;
        }
    } else {
        return req.headers.token || req.query.token;
    }
};
const middleeware = jwtMiddleware({
    secret: process.env.secret || '371314jffoiaujerkrhuibao',
    userProperty: 'payload',
    getToken: fromHeaderOrQuerystring,
    isRevoked: bearerStrategy
});
exports.jwt = middleeware;
exports.manager = function (req, res, next) {
    let user = req.user;
    if (!user || user.roles.indexOf('admin') < 0) {
        return next('admin only!');
    }
    next();
};