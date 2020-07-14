const Student = require('../models/storeData/Student'),
      Session = require('../models/consultData/TokenSession'),
      { evalRecivedData } = require('../middlewares/util');

exports.sign_in_post = [
(req, res, next) => {
    let {ok} = evalRecivedData(['email', 'password'], req.body);
    if(!ok){ res.sendStatus(422); return; }
    next();
 },async (req, res) => {
    const data = req.body,
          usr = new Student({
            email: data.email,
            password: data.password
          }),
          result = await usr.signIn();

    res.json(result);
}];

exports.sign_out_delete = [
(req, res, next) => {
    let {ok} = evalRecivedData(['token'], req.body);
    if(!ok){ res.sendStatus(422); return; }
    next();
},   
async (req, res) => {
    const { token } = req.body;
    await Session.close(token);
    res.send(true);
}];

exports.sign_up_post = [
(req, res, next) => {
    let shouldBeIn = ['name', 'email', 'password', 'semester', 'subjects'];
    let {ok} = evalRecivedData(shouldBeIn, req.body);
    if(!ok){ res.sendStatus(422); return; }
    next();
},
async function(req, res){
    const data = req.body,
          usr = new Student({
            name: data.name, 
            email: data.email, 
            password: data.password,
            semester: data.semester,
            subjects: data.subjects
          }),
          result = await usr.signUp();
    
    res.json(result);
}];