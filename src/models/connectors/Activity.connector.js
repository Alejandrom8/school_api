const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Responser = require('../sendData/Responser');
      

class ActivityConnector {

    /**
     * 
     * @param {String} activityID - the system generated ID for this activity.
     * @returns {Promise<Responser.Responser>} an object describing the proccess 
     * result.
     */
    static async getActivity(activityID) {
        return await performQuery(
            config.database.mongodb.dbStaticData,
            'activity',
            async collection => (
                await collection.findOne({activityID: activityID})
            )
        )
    }

    /**
     * 
     * @param {String[]} activityIDs - an array with activityID's.
     * @returns {Promise<Responser.Responser>} an object describing the proccess 
     * result.
     */
    static async getActivities(activityIDs) {

        let filters = activityIDs.map(id => {
            return {activityID: id}
        });

        return await performQuery(
            config.database.mongodb.dbStaticData,
            'activity',
            async collection => (
                await new Promise((resolve, reject) => {
                    collection.find({
                        $or: filters
                    }).toArray((err, data) => {
                        if(err) reject(err);
                        resolve(data);
                    })
                })
            )
        )
    }

    /**
     * 
     * @param {String} moduleID - the system generated ID for the searched
     * module.
     * @returns {Promise<Responser.Responser>} an object describing the proccess 
     * result.
     */
    static async getModuleActivities(moduleID) {
        return await performQuery(
            config.database.mongodb.dbStaticData,
            'activity',
            async collection => (
                await new Promise((resolve, reject) => {
                    collection.find({
                        moduleID: moduleID
                    }).toArray((err, data) => {
                        if(err) reject(err);
                        resolve(data);
                    })
                })
            )
        )
    }
}

module.exports = ActivityConnector;