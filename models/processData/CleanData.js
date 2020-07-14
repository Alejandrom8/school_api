// const MapSemester = require('../getData/MapSemester');

class CleanData{

    /**
     * 
     * @param {Semestre} semester 
     */
    constructor(semestre){
        this.semester = semestre;
        this.cleanSubjects();
    }

    getSemester(){
        return this.semester;
    }

    cleanSubjects(){
        this.semester.asignaturas.forEach(sub => {
            sub.clave = parseInt((sub.clave.match(/[0-9]+/gm)).toString());
        });
    }
}

// async function main(){
//     let mapsem = new MapSemester(2);
//     const cleaner = new CleanData(await mapsem.createSemester());
//     semester = cleaner.getSemester();
//     console.log(semester);
// }

// main();
module.exports = CleanData;