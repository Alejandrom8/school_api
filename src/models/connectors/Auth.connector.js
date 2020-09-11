const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Auth = require('../entities/Auth'),
      StudentConnector = require('./Student.connector'),
      crypt = require('../../util/crypt'),
      JWT = require('jsonwebtoken'),
      Responser = require('../sendData/Responser');


class AuthConnector {

    /**
     * 
     * @param {String} email - the email of the searched user.
     * @returns {Promise<Responser.Responser>} result
     * @returns {boolean} result.success - true if the user exists.
     * @returns {object} result.data - an object containing the auth data.
     */
    static async userExists(email) {
        let result = await performQuery(
            config.database.mongodb.dbSchool,
            'auth',
            async collection => (
                await collection.findOne({email: email})
            )
        )
        return result;
    }

    /**
     * This method generates a token with the ID of the authenticated user.
     * @param {String} userID - the system generated ID to identify this token.
     * @returns {String} the generated json web token.
     */
    static genToken(userID) {
        return JWT.sign(
            {user: userID}, 
            config.authJwtSecret,
            {expiresIn: '1h'} //this token expires in one hour
        )
    }

    /**
     * 
     * @param {String} email - the email of the user to be authenticated.
     * @param {String} password - the password of the user in it's simplest form
     * (not hashed) of the user to be authenticated.
     * @returns {Promise<String>} a token for the authenticated user.
     */
    static async auth(email, password) {
        let user = await AuthConnector.userExists(email);
        if(!user.success) throw 'The user doesnt exists';

        let passwordIsValid = await crypt.comparePasswords(
            password, 
            user.data.password
        );
        if(!passwordIsValid) throw 'The password is not valid';

        let token = AuthConnector.genToken(user.data.userID);
        return token;
    }

    /**
     * 
     * @param {String} email - the email of the user to be authenticated.
     * @param {String} password - the password in the simplest form (not hashed)
     * of the user to be authenticated.
     * @returns {Promise<object>} result
     * @returns {String} result.token - the access token for this user.
     * @returns {object} result.sc - an instance of StudentConnector
     * with the authenticated user data.
     */
    static async createAuth(email, password) {
        let exists = await AuthConnector.userExists(email);
        
        if(exists.success) throw 'the user exists';

        let auther = await Auth.getInstance(email, password);
        let result = await performQuery(
            config.database.mongodb.dbSchool,
            'auth',
            async collection => {
                return await collection.insertOne(auther)
            }
        )

        if(!result.success) throw 'We cannot create the user authentication';

        let token = AuthConnector.genToken(auther.userID);

        return {
            token: token,
            sc: new StudentConnector(auther.userID, auther.email)
        }
    }
}

module.exports = AuthConnector;