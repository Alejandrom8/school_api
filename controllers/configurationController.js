//Models
const CleanData = require('../models/processData/CleanData');
const MapSemester = require('../models/getData/MapSemester');

exports.semester_obj_get = async function(req, res){
    const semesterID = req.params.semesterID;
    
    let mapsem = new MapSemester(semesterID);
    let semester = await mapsem.createSemester();
    let cleaner = new CleanData(semester);

    semester = cleaner.getSemester();
    res.send(JSON.stringify(semester));
}