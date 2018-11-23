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
        getSerializer: () => {
            return this.businessNetworkDefinition.getSerializer();
        },
        submitTransaction: async (resource)=> {
            return await this.bizNetworkConnection.submitTransaction(resource);
        },
        getAssetRegistry: async (type) => {
            return await this.bizNetworkConnection.getAssetRegistry(type);
        },
        newResource: (namespace, resource, id) => {
            const factory = this.businessNetworkDefinition.getFactory();
            return factory.newResource(namespace, resource, id);
        },
        addAsset: async (type, resource) => {
            const registry = await self.getAssetRegistry(type);
            await registry.add(resource);
        },
        getParticipantRegistry: async (type) => {
            return await this.bizNetworkConnection.getParticipantRegistry(type);
        },
        addParticipant: async(type, participant) => {
            const registry = await self.getParticipantRegistry(type);
            await registry.add(participant);
        }
    };
})()

module.exports = bs;