class CompleteSubject {

    constructor({
        semesterID, //the scheduledSubject semesterID
        subjectID, //subject
        scheduledSubjectID, //scheduledSubject
        name, // subject
        key, //subject
        planDeTrabajoURL, //subject 
        apunteURL, //subject
        actividadesURL, //subject
        professorName, //scheduledSubject
        color, //scheduledSubject
        schedules, //scheduledSubject
        califications = { //scheduledSubject
            subjectCalif: 0, 
            ponderations: []
        }
    }) {
        this.semesterID = semesterID;
        this.subjectID = subjectID;
        this.scheduledSubjectID = scheduledSubjectID;
        this.name = name;
        this.key = key;
        this.planDeTrabajoURL = planDeTrabajoURL;
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
        this.professorName = professorName;
        this.color = color;
        this.schedules = schedules;
        this.califications = califications;
    }

    static getInstance(subject, scheduledSubject) {
        delete subject.semesterID;
        return new CompleteSubject({...subject, ...scheduledSubject});
    }
}

module.exports = CompleteSubject;