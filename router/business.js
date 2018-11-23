"use strict";
const errors = require('restify-errors');
const bs = require('../lib/businessNetwork');
const auth = require('../lib/auth');

module.exports = (server) => {
    // server.get('/balanceOf/:account', auth.jwt, auth.manager, async (req, res, next) => {
    server.get('/network/user/register', auth.jwt, async (req, res, next) => {
        console.log(req.user);
        res.send({
            output: 'ok'
        });
        next();
    });
    server.get('/product/flightDelay/join/:NO/:Date', async (req, res, next) => {
        try {
            const networkConnetion = bs.getNetworkConnection();
            const networkDefinition = bs.getNetworkDefinition();
            const serializer = networkDefinition.getSerializer();
            const resource = serializer.fromJSON({
                '$class': 'org.huibao.product.flightDelay.transaction.JoinTx',
                'user': 'uid',
                'flightInfo': 'fid'
            });
            const contract = await networkConnetion.submitTransaction(resource); 
            res.send({
                output: contract
            });
            next();
        } catch (err) {
            next(new errors.InternalServerError(err));
        }
    });
}