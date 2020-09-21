const Entity = require('../Entity');

class GlobalConfig extends Entity {
    constructor(userID) {
        super('configuration');
        this.userID = userID;
        this.type = 'global';
        this.selectedSemester = null;
    }
}

module.exports = GlobalConfig;