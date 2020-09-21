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

        AuthConnector
            .auth(email, password)
            .then(({token, refresh_token}) => {
                res.status(200).json({success: true, data: {token, refresh_token}})
            })
            .catch(error => {
                res.status(401).json({success: false, errors: error})
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
        let finalToken, finalRefreshToken;

        AuthConnector
            .createAuth(email, password)
            .then(({token, refresh_token, sc}) => {
                finalToken = token;
                finalRefreshToken = refresh_token;
                return sc.signUp(name, lastName, university, career)
            })
            .then(result => {
                result.data = {
                    token: finalToken,
                    refresh_token: finalRefreshToken
                };
                res.status(200).json(result);
            })
            .catch(({error, status}) => {
                res.status(status).json({success:false, errors: error});
            });
    }
];

exports.refresh = [
    (req, res, next) => requestValidator(
        res, 
        next, 
        req.body, 
        'refresh_token'
    ),
    function (req, res) {
        let {refresh_token} = req.body;
        AuthConnector
            .refreshToken(refresh_token)
            .then( token => {
                res.status(200).json({success: true, data: {token}});
            })
            .catch(({status, error}) => {
                res.status(status).json({success: false, errors: error});
            });
    }
];


exports.logout = [
    (req, res, next) => requestValidator(res, next, req, 'userID'),
    function (req, res) {
        let {userID} = req;
        AuthConnector
            .logout(userID)
            .then(() => {
                res.status(200);
            })
            .catch(({status, error}) => {
                res.status(status).json({success: false, errors: error});
            });
    }
]