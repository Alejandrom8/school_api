const Entity = require('../Entity');
/**
 * creates a new Subject.
 * @class
 */
class Subject extends Entity {
    /**
     * @param {String} semesterID - the number of the semester to wich this
     * subject belongs.
     * @param {String} name - name of the subject.
     * @param {String} key - the real key (that one given by the university)
     * that identifies this subject.
     * @param {URL} planDeTrabajoURL - URL direction for the "plan de 
     * trabajo" PDF document for this subject. This one will only exists for the 
     * SUA education mode.
     * @param {URL} apunteURL - URL directrion for the "apunte" PDF 
     * document of this subject. This one will only exists for the SUA education 
     * mode.
     * @param {URL} actividadesURL - URL direction for the "actividades" 
     * PDF document of this subject. This one will only exists for the SUA 
     * education mode.
     */
    constructor(
        semesterID,
        name, 
        key, 
        planDeTrabajoURL, 
        apunteURL, 
        actividadesURL
    ) {
        super('subject');
        this.semesterID = semesterID;
        this.name = name;
        this.key = key;
        this.planDeTrabajoURL = planDeTrabajoURL;
        this.apunteURL = apunteURL;
        this.actividadesURL = actividadesURL;
    }
}

module.exports = Subject;
