const MongoClient = require('mongodb').MongoClient
const config = require('../../config')

/**
 * @class
 */
class DataBase {
  /**
   * 
   * @returns {Promise<MongoClient>} the mongo client.
   */
  static async getClient () {
    const client = await MongoClient.connect(
      config.database.mongodb.url,
      config.database.mongodb.options
    )
    if (!client) throw 'We can not make a connection with the mongo database.'
    return client
  }

  /**
   * @param {String} [db = 'school'] - the database where will be connected 
   * this client.
   * @param {String} collection - the name of the collection that will be searched
   * @returns {Promise<[Collection, MongoClient]>} [collection, client]
   */
  static async getCollection (
    db = config.database.mongodb.dbSchool,
    collection
  ) {
    const client = await DataBase.getClient()
    const database = client.db(db)
    return [database.collection(collection), client]
  }
}

module.exports = DataBase
