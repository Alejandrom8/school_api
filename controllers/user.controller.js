const Student = require('../models/storeData/Student'),
      DataBase = require('../models/DataBase'),
      Responser = require('../models/sendData/Responser'),
      { evalRecivedData } = require('../middlewares/util');

exports.getUserInfo = [(req, res, next) => {
    let { ok } = evalRecivedData(['token'], req.query);
    if(!ok) {res.sendStatus(422); return;}
    next();
}, async (req, res) => {
    let token = req.query.token,
        data = await Student.getMainInfo(token);
    res.send(data);
}];

exports.searchEmail = async (req, res) => {
    let result = new Responser();

    if(!req.query){ 
        result.errors = 'No se incluyo un email en la busqueda';
        res.send(result); 
        return;
    }

    let email = req.query.email,
        db = new DataBase(),
        search = await db.searchCoincidencesForEmail(email);

    result.setSuccess({
        messages: search ? 'El email no existe' : 'El email existe',
        data: {
            exists: search
        }
    })

    res.send(result);
}

