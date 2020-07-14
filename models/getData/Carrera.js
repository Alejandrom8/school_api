const Asignatura = require('./Asignatura');
const Semestre = require('./Semestre');

class Carrera{
    constructor(carrera, semetre){
        this.carrera = carrera
        this.semestre = new Semestre(semetre)
    }
}

module.exports = Carrera;