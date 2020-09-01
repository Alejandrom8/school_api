const JWT = require('jsonwebtoken'),
      config = require('../../config');

/**   
 * evalRecivedData - recorre el objeto dado verificando que las 
 * llaves contenidas en shouldBeIn existan y sean verdaderas en
 * el objeto.
 * @param {Object} - the object recived (req.body)
 * @param {[...string]} - the keys that should be recived
 * @return {{[string], boolean}} - an array containing the values that where recived
 */

exports.evalRecivedData = (recived, ...expected) => {
    let result = {evaulated: [], ok: false};
    let recivedKeys = Object.keys(recived);

    if(recived == null || recivedKeys.length == 0) return result;

    result.evaluated = expected.map( expectedKey => {
        let itsOk = recivedKeys.some( key => {
            return key == expectedKey && recived[key] != null && recived[key] != "";
        })
        return itsOk ? null : expectedKey;
    });

    result.ok = result.evaluated.every(v => v == null);
    result.evaluated = result.evaluated.filter(e => e != null);

    return result;
};

exports.MissingData = (data) => {
    return `missing data: ${data}`;
}

exports.requestValidator = (res, next, recived, ...expected) => {
    let result = exports.evalRecivedData(recived, ...expected);
    if(!result.ok){
        res.status(422).send(exports.MissingData(result.evaluated));
        return
    }
    next();
}

exports.tokenValidator = (req, res, next) => {
    const tokenHeader = req.headers.authorization;

    if(tokenHeader) {
        let token = tokenHeader.split(' ')[1];

        if(token) {
            JWT.verify(token, config.authJwtSecret, (error, { user }) => {
                if(!error) {
                    req.userID = user;
                    next();
                }else{
                    res.sendStatus(403);
                }
            });
        }else{
            res.sendStatus(401);
        }
    }else{
        res.sendStatus(401);
    }
}