const Entity = require('./Entity');

class File extends Entity {
    constructor(semesterID, type, path) {
        super('file');
        this.semesterID = semesterID;
        this.type = type;
        this.path = path;
    }
}

module.exports = File;