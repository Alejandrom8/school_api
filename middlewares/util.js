/**   
 * evalRecivedData - recorre el objeto dado verificando que las 
 * llaves contenidas en shouldBeIn existan y sean verdaderas en
 * el objeto.
 * @param {[string]} - the keys that should be recived
 * @param {Object} - the object recived (req.body)
 * @return {{[boolean], boolean}} - an array containing the values that where recived
 */
exports.evalRecivedData = (shouldBeIn, recived) => {
    let evaluated = [], ok = false;

    if(recived != null && Object.keys(recived).length > 0){
        evaluated = shouldBeIn.map( current => {
            return Object.keys(recived).some(key => key == current);
        });
        ok = evaluated.every(v => v === true);
    }

    return {
        evaluated: evaluated,
        ok: ok
    };
}