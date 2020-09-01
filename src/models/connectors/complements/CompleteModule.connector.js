const ModuleConnector = require('../Module.connector'),
      ActivityConnector = require('../Activity.connector');


class CompleteModuleConnector {
    static async getCompleteModulesForSubject(subjectID) {
        let modules = await ModuleConnector.getSubjectModules(subjectID);

        let result = [];

        for(let mdle of modules.data) {
            let activities = await ActivityConnector.getModuleActivities(mdle.moduleID);
            mdle.activities = activities.data;
            result[mdle.index] = mdle;
        }

        return result;
    }
}

module.exports = CompleteModuleConnector;
