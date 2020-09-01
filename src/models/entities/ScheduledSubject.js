const Entity = require('./Entity');

class Schedule {
    /**
     * 
     * @param {String} day - the day when this event are going to ocurrs.
     * @param {object} schedule - the shedule for this event.
     * @param {String} schedule.from - when starts this event? (hour:min)
     * @param {String} schedule.to - when finishes this event? (hour:min)
     * @param {object} param2
     * @param {String} [param2.room = null] - just if have one.
     * @param {String} [param2.videoPlatform = null] - just if are going to be
     * online.
     * @property {String} [method = ('ftf' | 'on')] - the method of view this
     * event, if this event is on a room, the method will be 'ftf'. If its
     * online, this property will be equals to 'on'.
     */
    constructor(day, schedule, {room = null, videoPlatform = null}) {
        this.day = day;
        this.schedule = schedule;
        this.methodValue = room ? room : videoPlatform;

        this.method = room ? 'ftf' : 'on';
    }
}

class ScheduledSubject extends Entity {

    /**
     * @param {String} semesterID - the ID of the semester to which this 
     * subject belongs.
     * @param {String} subjectID - the FCA ID for this subject.
     * @param {String} profesorName - the name of the propfesor that 
     * imparts this subject.
     * @param {String} color - the hexadecimal color representing this
     * sheduledSubject.
     * @param {Schedule[]} schedules - the different schedules on which this 
     * subject is imparted.
     * @param {object} califications - the califications for each activity and
     * for this subject.
     * @param {Number} califications.subjectCalif - the calification of this 
     * subject.
     * @param {Number} califications.otherWeights[].calif
     * @param {Number} califications.otherWeights[].weight
     * @param {Number} califications.otherWeights[].name
     */
    constructor(
        semesterID, 
        subjectID, 
        profesorName, 
        color, 
        schedules, 
        califications = {
            subjectCalif: 0, 
            ponderations: []
        }
    ) {
        super('scheduledSubject');
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.profesorName = profesorName;
        this.color = color;
        this.schedules = schedules;
        this.califications = califications;
    }
}

module.exports = ScheduledSubject;