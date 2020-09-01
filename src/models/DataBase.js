const MongoClient = require('mongodb').MongoClient,
      config = require('../../config');

/**
 * @class
 */
class DataBase {
    /**
     * 
     * @returns {object} the mongo client.
     */
    static async getClient() {
        let client = await MongoClient.connect(
            config.database.mongodb.url, 
            config.database.mongodb.options
        );
        return DataBase.evalClient(client);
    }

    static evalClient(client) {
        if(!client){
            throw "No se pudo conectar a la base de datos";
        }
        return client;
    }

    /**
     * @param {String} [db = 'school'] - the database where will be connected 
     * this client.
     * @param {String} collection - the name of the collection that will be 
     * getted.
     * @returns {Promise<[object, object]>} [collection, client]
     */
    static async getCollection(
        db = config.database.mongodb.dbSchool,
        collection
    ) {
        let client = await DataBase.getClient();
        let dbmc = client.db(db);
        return [dbmc.collection(collection), client];
    }
}

module.exports = DataBase;