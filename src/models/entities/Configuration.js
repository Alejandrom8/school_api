const Entity = require('./Entity');

class Configuration extends Entity {
    constructor({
        selectedSemester,
        activitiesConfig = []
    }){
        super('configuration');
        this.selectedSemester = selectedSemester;
        this.activitiesConfig = activitiesConfig;
    }
}

module.exports = Configuration;