"use strict";
const errors = require('restify-errors');
const bs = require('../lib/businessNetwork');
const auth = require('../lib/auth');

module.exports = (server) => {
    // server.get('/balanceOf/:account', auth.jwt, auth.manager, async (req, res, next) => {
    server.post('/network/user/register', auth.jwt, async (req, res, next) => {
        const uid = req.user.name;
        const input = req.body.input;
        if (!input.idNO) {
            throw '证件号码必须录入';
        }
        const userRegistry = await bs.getRegistry('org.huibao.participant.User');
        const exists = await userRegistry.exists(uid);
        if (exists) {
            res.send({
                output: '已注册用户'
            });
        } else {
            const newUser = bs.newResource('org.huibao.participant', 'User', uid);
            newUser.idNO = input.idNO;
            newUser.name = req.user.fullName;
            await bs.addResource('org.huibao.participant.User', newUser);
            res.send({
                output: `成功注册新用户: ${newUser.uid}`
            });
        }
        
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