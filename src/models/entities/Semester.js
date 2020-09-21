const Entity = require('./Entity');

class Semester extends Entity {

    /**
     * This semester object is used to group a set of subjects, files, 
     * califications and other kind of objects that is required to each School 
     * Iteration that make the student.
     * @param {Number} key - the real key of the semester.
     * @param {String} userID - the system generated ID of the user to 
     * which this semester belongs.
     * @property {Date} date - the date when this semester was created.
     * @property {object} configuration - this will store all the changeable data
     * between semesters.
     */
    constructor(key, userID) {
        super('semester');
        this.key = key;
        this.userID = userID;

        //default properties
        this.date = new Date(); //the date when this semester whas created.
    }
}

module.exports = Semester;