const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Responser = require('../sendData/Responser');


class ModuleConnector {
    /**
     * search a module by the given moduleID in the FCA database and returns
     * the complete document.
     * @param {String} moduleID - the system generated key for the searched
     * module.
     * @returns {Promise<Responser.Responser>} where data is a Module object.
     */
    static async getModule(moduleID) {
        return await performQuery(
            config.database.mongodb.dbStaticData,
            'module',
            async collection => (
                await collection.findOne({moduleID: moduleID})
            )
        )
    }

    /**
     * search various modules by the given array of ID's in the FCA database.
     * @param {String[]} moduleIDs - an array of ID's of the searched modules.
     * @returns {Promise<Responser.Responser>} where data is an array containing
     * the module objects.
     */
    static async getModules(moduleIDs) {

        let filters = moduleIDs.map(id => {
            return {moduleID: id}
        });

        return await performQuery(
            config.database.mongodb.dbStaticData,
            'module',
            async collection => (
                await new Promise( (resolve, reject) => {
                    collection.find({
                        $or: filters
                    }).toArray( (err, data) => {
                        if(err) reject(err);
                        resolve(data);
                    })
                })
            )
        )
    }

    /**
     * search the modules for a specific subject by it's ID.
     * @param {String} subjectID - the system generated ID of the subject that
     * have the searched modules.
     * @returns {Promise<Responser.Responser>} where data is an array containing
     * the module objects.
     */
    static async getSubjectModules(subjectID) {
        return await performQuery(
            config.database.mongodb.dbStaticData,
            'module',
            async collection => (
                await new Promise( (resolve, reject) => {
                    collection.find({
                        subjectID: subjectID
                    }).toArray( (err, data) => {
                        if(err) reject(err);
                        resolve(data);
                    })
                })
            )
        )
    }
}

module.exports = ModuleConnector;