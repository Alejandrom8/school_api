const MongoClient = require('mongodb').MongoClient,
      config = require('../../config');

/**
 * @class
 */
class DataBase {
    /**
     * 
     * @returns {Promise<MongoClient>} the mongo client.
     */
    static async getClient() {
        let client = await MongoClient.connect(
            config.database.mongodb.url, 
            config.database.mongodb.options
        );
        if(!client) throw "We can not make a connection with the mongo database.";
        return client;
    }

    /**
     * @param {String} [db = 'school'] - the database where will be connected 
     * this client.
     * @param {String} collection - the name of the collection that will be searched
     * @returns {Promise<[Collection, MongoClient]>} [collection, client]
     */
    static async getCollection(
        db = config.database.mongodb.dbSchool,
        collection
    ) {
        let client = await DataBase.getClient();
        let database = client.db(db);
        return [database.collection(collection), client];
    }
}

module.exports = DataBase;