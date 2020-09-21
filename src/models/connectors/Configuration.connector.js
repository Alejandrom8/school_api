const {performQuery} = require('./Connector'),
      GlobalConfig = require('../entities/UI/GlobalConfig'),
      SubjectConfig = require('../entities/UI/SubjectConfig'),
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
    static async getConfiguration(query) {
        return await performQueryConf(
            async configCollection => (
                await configCollection.findOne(query)
            )
        )
    }

    static async setConfigElement(query, {elementName, elementValue}) {
        let updater = {$set: {}};
        updater.$set[elementName] = elementValue;

        return await performQueryConf(
            async collection => (
                await collection.updateOne(query,updater)
            )
        )
    }

    static async createGlobalConfig(userID) {
        let gobj = new GlobalConfig(userID);
        return await performQueryConf(
            async collection => await collection.insertOne(gobj)
        )
    }

    static async updateSelectedSemester(userID, semesterID) {
        return await performQueryConf(
            async collection => (
                await collection.updateOne(
                    {userID: userID, type: 'global'},
                    {$set: { selectedSemester: semesterID } }
                )
            )
        )
    }

    static async createSubjectConfig(semesterID, scheduledSubjectID) {
        let sobj = new SubjectConfig(semesterID, scheduledSubjectID);
        return await performQueryConf(
            async collection => await collection.insertOne(sobj)
        )
    }

    static async activityExists(scheduledSubjectID, activityID) {
        let result = await performQueryConf(
            async collection => (
                await collection.findOne({
                    scheduledSubjectID,
                    activitiesProgress: {$elemMatch: {activityID}}
                })
            )
        );
        return result.success;
    }

    static async createActivityState(scheduledSubjectID, activityID, state) {
        let nas = {activityID, state};
        return await performQueryConf(
            async collection => (
                await collection.updateOne(
                    {scheduledSubjectID},
                    {$push: {activitiesProgress: nas}}
                )
            )
        )
    }

    static async updateActivitiesProgress(scheduledSubjectID, activityID, activityState) {
        let exists = await ConfigurationConnector.activityExists(scheduledSubjectID, activityID);
        if(!exists) {
            let result = await ConfigurationConnector.createActivityState(scheduledSubjectID, activityID, activityState);
            return result;
        }else{
            console.log("update");
            let result = await performQueryConf(
                async collection => (
                    await collection.updateOne(
                        {
                            scheduledSubjectID, 
                            activitiesProgress: {
                                $elemMatch: {
                                    "activityID": activityID
                                }
                            }
                        },
                        {$set: {"activitiesProgress.$.state": activityState} }
                    )
                )
            )
            return result;
        }
    }
}
