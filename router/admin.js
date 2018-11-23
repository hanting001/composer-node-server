"use strict";
const errors = require('restify-errors');
const bs = require('../lib/businessNetwork');

module.exports = (server) => {
    // server.get('/balanceOf/:account', auth.jwt, auth.manager, async (req, res, next) => {
    server.post('/product', async (req, res, next) => {
        try {
            const input = req.body.input;
            const product = bs.newResource('org.huibao.product.flightDelay.asset', 'FlightDelayProduct', input.pid);
            product.premium = input.premium * 100;
            product.name = input.name;
            product.description = input.description;
            product.status = input.status;
            product.type = input.type;
            await bs.addAsset('org.huibao.product.flightDelay.asset.FlightDelayProduct', product);
            const productRegistry = await bs.getAssetRegistry('org.huibao.product.flightDelay.asset.FlightDelayProduct');
            const result = await productRegistry.get(input.pid);
            res.send({
                output: result
            });
            next();
        } catch (err) {
            next(new errors.InternalServerError(err));
        }
    });

}