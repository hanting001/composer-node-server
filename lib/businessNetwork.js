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
        },
        getRegistry: async (type) => {
            return await this.bizNetworkConnection.getAssetRegistry(type);
        },
        newResource: (namespace, resource, id) => {
            const factory = this.businessNetworkDefinition.getFactory();
            return factory.newResource(namespace, resource, id);
        },
        addResource: async (type, resource) => {
            const registry = await self.getRegistry(type);
            await registry.add(resource);
        }
    };
})()

module.exports = bs;