const Entity = require('../Entity');

/**
 * creates an instance of an Activity object.
 * @class
 */
class Activity extends Entity {
    /**
     * @param {String} moduleID - the system generated key for the module to
     * which this activity belongs.
     * @param {String} content - the instructions for this activity.
     * @param {String} index - the index that sort each module. (1 - n) where n
     * its the number of activities, this number should be restarted for every
     * module.
     */
    constructor(moduleID, content, index) {
        super('activity');
        this.moduleID = moduleID;
        this.content = content;
        this.index = index;
    }
}

module.exports = Activity;