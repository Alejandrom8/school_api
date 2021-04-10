const MongoClient = require('../DataBase'),
      Responser = require('../sendData/Responser');

/**
* this function should do all the necesary stuff with the mongodb commands
* and return the result of that process.
* @callback querierFuntion
* @param {object} collection - the Collection returned by the DB connection.
* @returns {any} - the result of the process should be thruty, instead the
* result of the proccess will be an error.
 */
/**
 * simplify the process of performing an operation to the mongo database.
 * @param {String} db 
 * @param {String} collectionName 
 * @param {querierFuntion} querier
 * @returns {Promise<Response>}
 */
exports.performQuery = async (db, collectionName, querier) => {
    let result = new Responser();
    let collection, client;

    try {
        [collection, client] = await MongoClient.getCollection(
            db,
            collectionName
        );
        let queryResult = await querier(collection);
        
        if(!queryResult) throw { 
            error: 'There was an error while performing this query',
            status: 500
        }

        if(!('result' in queryResult) && !queryResult)
            throw `No hay resultados para esta petición o hubo un error.`;
            
        if('result' in queryResult){
            if(!queryResult.result.ok)
                throw `Insert: No se insertaron correctamente los datos.`;
        }

        result.setSuccess({ data: queryResult });
    } catch (error) {
        console.log(error);
        result.errors = error;
    } finally {
        client.close();
    }

    return result;
}
