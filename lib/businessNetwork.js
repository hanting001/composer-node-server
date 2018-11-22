const config = require('config');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const bs = (() => {
    return self = {
        init: async () => {
            const cardName = config.get('businessNetwork.cardName');
            console.log(cardName);
            this.bizNetworkConnection = new BusinessNetworkConnection();
            this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardName);
        },
        getNetworkDefinition: () => {
            return this.businessNetworkDefinition;
        },
        getNetworkConnection: () => {
            return this.bizNetworkConnection;
        }
    };
})()

module.exports = bs;