"use strict";
const errors = require('restify-errors');
const bs = require('../lib/businessNetwork');

module.exports = (server) => {
    // server.get('/balanceOf/:account', auth.jwt, auth.manager, async (req, res, next) => {
    server.get('/product/:pid', async (req, res, next) => {
        try {
            const networkConnetion = bs.getNetworkConnection();
            const productRegistry = await networkConnetion.getAssetRegistry('org.huibao.product.flightDelay.asset.FlightDelayProduct');
            const exists = await productRegistry.exists(req.params.pid);
            if (!exists) {
                res.send({
                    output: null
                });
            } else {
                const product = await productRegistry.get(req.params.pid);
                res.send({
                    output: product
                });
            }
            next();
        } catch (err) {
            next(new errors.InternalServerError(err));
        }
    });

    server.get('/product/:pid/price/:flightNO/:flightDate', async (req, res, next) => {
        try {
            const networkConnetion = bs.getNetworkConnection();
            const networkDefinition = bs.getNetworkDefinition();
            const serializer = networkDefinition.getSerializer();
            const resource = serializer.fromJSON({
                '$class': 'org.huibao.product.flightDelay.transaction.GetPriceTx',
                'pid': req.params.pid
            });
            const price = await networkConnetion.submitTransaction(resource);
            res.send({
                output: price
            });
            next();
        } catch (err) {
            next(new errors.InternalServerError(err));
        }
    });

}