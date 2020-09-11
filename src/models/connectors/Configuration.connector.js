const {performQuery} = require('./Connector'),
      Configuration = require('../entities/Configuration'),
      config = require('../../../config');

/**
 *
 * @param maker
 * @returns {Promise<Responser.Responser>}
 */
async function performQueryConf(maker) {
    return await performQuery(
        config.database.mongodb.dbSchool,
        'configuration',
        maker
    )
}

module.exports = class ConfigurationConnector {
    /**
     *
     * @param {String} configurationID
     */
    static async getConfiguration(configurationID) {
        return await performQueryConf(
            async configCollection => (
                await configCollection.findOne({configurationID})
            )
        )
    }

    /**
     *
     * @param {object} initialConfig
     * @returns {Promise<object>}
     */
    static async createConfiguration(initialConfig) {
        let configObj = new Configuration(initialConfig);
        return await performQueryConf(
            async configCollection => (
                await configCollection.insertOne(configObj)
            )
        )
    }

    static async addSemesterConfig(configurationID, semesterConfig) {
        return await performQueryConf(
            async collection => {

            }
        )
    }

    static async setConfigElement(configurationID, {elementName, elementValue}) {
        return await performQueryConf(
            async collection => {
                const updater = {$set: {}};
                updater.$set[elementName] = elementValue;
                return collection.updateOne(
                    {configurationID},
                    updater
                );
            }
        )
    }

    static async setActivityState(configurationID, activityID, activityState) {
        return await performQueryConf(
            async collection => (
                await collection.updateOne(
                    {configurationID, "activitiesConfig.$.activityID": activityID},
                    { $set: {"activitiesConfig.$.state": activityState} }
                )
            )
        )
    }
}
