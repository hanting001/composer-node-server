"use strict";
const errors = require('restify-errors');
const bs = require('../lib/businessNetwork');
const auth = require('../lib/auth');
const config = require('config');
const request = require('request-promise');

module.exports = (server) => {
    // server.get('/balanceOf/:account', auth.jwt, auth.manager, async (req, res, next) => {
    server.post('/network/user/register', auth.jwt, async (req, res, next) => {
        try {
            const uid = req.user.name;
            const input = req.body.input;
            if (!input.idNO) {
                throw '证件号码必须录入';
            }
            const userRegistry = await bs.getParticipantRegistry('org.huibao.participant.User');
            const exists = await userRegistry.exists(uid);
            if (exists) {
                res.send({
                    output: '已注册用户'
                });
            } else {
                const newUser = bs.newResource('org.huibao.participant', 'User', uid);
                newUser.idNO = input.idNO;
                newUser.name = req.user.fullName;
                await bs.addParticipant('org.huibao.participant.User', newUser);
                res.send({
                    output: `成功注册新用户: ${newUser.uid}`
                });
            }

            next();
        } catch (err) {
            next(new errors.InternalServerError(err));
        }
    });
    server.get('/product/join/:pid/:NO/:date',  async (req, res, next) => {
        try {
            // check flight
            const feichangzhun = config.get('feichangzhun.api');
            const url = feichangzhun + `/flight/check/${req.params.NO}/${req.params.date}`;
            const options = {
                url: url,
                json: true
            }
            const result = await request(options);
            
            const flightInfo = result.output;
            // check user
            const userRegistry = await bs.getParticipantRegistry('org.huibao.participant.User');
            const user = await userRegistry.get('hanting');
            //no exeption
            const tx = bs.newTransaction('org.huibao.product.flightDelay.transaction', 'JoinTx');
            tx.pid = req.params.pid;
            tx.user = bs.newRelationship('org.huibao.participant', 'User', user.uid);
            tx.flightInfo = bs.newRelationship('org.huibao.product.flightDelay.asset', 'FlightInfo', flightInfo.fid);
            const contract = await bs.submitTransaction(tx);
            res.send({
                output: contract
            });
            next();
        } catch (err) {
            next(new errors.InternalServerError(err));
        }
    });
}