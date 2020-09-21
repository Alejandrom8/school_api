const Entity = require('../Entity');

class SubjectConfig extends Entity {
    /**
     * 
     * @param {string} semesterID
     * @param {string} scheduledSubjectID
     * @param {object[]} activitiesProgress
     */
    constructor(semesterID, scheduledSubjectID, activitiesProgress = []) {
        super('configuration');
        this.semesterID = semesterID;
        this.type = 'subject';
        this.scheduledSubjectID = scheduledSubjectID;
        this.activitiesProgress = activitiesProgress;
    }
}

module.exports = SubjectConfig;