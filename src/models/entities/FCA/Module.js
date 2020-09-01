const Entity = require('../Entity');

/**
 * creates an instance of the Module class
 * @class
 */
class Module extends Entity {
    /**
     * @param {String} moduleID - the system generated key for this module.
     * @param {String} subjectID - the university key of the subject to wich
     * this module belongs.
     * @param {String} moduleTitle - the title for this module.
     * @param {Number} index - the index that sort each module.
     */
    constructor(subjectID, moduleTitle, index) {
        super('module');
        this.subjectID = subjectID;
        this.moduleTitle = moduleTitle;
        this.index = index;
    }
}

module.exports = Module;