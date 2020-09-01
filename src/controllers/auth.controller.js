const AuthConnector = require('../models/connectors/Auth.connector'),
      { evalRecivedData, MissingData } = require('../util/validator');

exports.signIn = [
    (req, res, next) => {
        let result = evalRecivedData(req.body, 'email', 'password');
        if(!result.ok){ 
            res.status(422).send(MissingData(result.evaluated));
            return
        }
        next();
    },
    async (req, res) => {
        const {email, password} = req.body;

        try{
            const token = await AuthConnector.auth(email, password);
            res.json({
                success: true,
                data: {token: token}
            });
        }catch(error){
            res.json({
                success:false,
                errors: error
            })
        }
    }
];

exports.signUp = [
    (req, res, next) => {
        let expectedKeys = ['name', 'lastName', 'email', 'password', 'university', 'career'];
        let result = evalRecivedData(req.body, ...expectedKeys);
        if(!result.ok) {
            res.status(422).send(MissingData(result.evaluated));
            return
        }
        next();
    },
    async (req, res) => {
        let {email, password} = req.body;
        let {name, lastName, university, career} = req.body;

        try {
            let {token, sc} = await AuthConnector.createAuth(email, password);
            let creationResult = await sc.signUp(name, lastName, university, career);
            if(!creationResult.success) throw creationResult.errors;

            creationResult.data = {token: token};
            res.json(creationResult);
        } catch(error) {
            res.json({
                success: false,
                errors: error
            })
        }
    }
];