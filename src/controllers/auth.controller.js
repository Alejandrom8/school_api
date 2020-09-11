const AuthConnector = require('../models/connectors/Auth.connector'),
      { requestValidator } = require('../util/validator');

/**
 *
 * @type {((function(*, *=, *=): undefined)|(function(*, *): void))[]}
 */
exports.signIn = [
    (req, res, next) => requestValidator(res, next, req.body, 'email', 'password'),
    function (req, res) {
        const {email, password} = req.body;
        AuthConnector.auth(email, password)
            .then( token => {
                res.json({success: true, data: {token}})
            })
            .catch(error => {
                res.json({success: false, errors: error})
            });
    }
];

/**
 *
 * @type {((function(*=, *, *=): void)|(function(*, *): void))[]}
 */
exports.signUp = [
    function (req, res, next) {
        let expectedKeys = ['name', 'lastName', 'email', 'password', 'university', 'career'];
        requestValidator(req, next, req.body, ...expectedKeys);
    },
    function (req, res) {
        let {email, password} = req.body;
        let {name, lastName, university, career} = req.body;
        let finalToken;

        AuthConnector.createAuth(email, password)
            .then(({token, sc}) => {
                finalToken = token;
                return sc.signUp(name, lastName, university, career)
            })
            .then(result => {
                result.data = {token: finalToken};
                res.json(result);
            })
            .catch(error => {
                res.json({success:false, errors: error});
            });
    }
];
