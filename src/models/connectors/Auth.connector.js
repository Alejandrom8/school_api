const { performQuery } = require('./Connector'),
      config = require('../../../config'),
      Auth = require('../entities/Auth'),
      crypt = require('../../util/crypt'),
      JWT = require('jsonwebtoken'),
      Responser = require('../sendData/Responser'),
      {genRandomKey} = require('../../util/generators');


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
     * @returns {Promise<String>} the generated json web token.
     */
    static async genToken(userID, type) {
        let expireTime = type === 'auth' ? 900 : '7d';
        return await new Promise((resolve, reject) => {
            JWT.sign(
                {
                    userID: userID,
                    type: type
                }, 
                config.authJwtSecret,
                {expiresIn: expireTime},
                (err, encoded) => {
                    if(err) reject(err);
                    resolve(encoded);
                }
            )
        });
    }

    static async refreshToken(refresh_token) {
        let data = JWT.verify(refresh_token, config.authJwtSecret);
        if(data.type !== 'refresh') throw {
            status: 401, 
            error: 'the refresh token is invalid'
        }

        let token = await AuthConnector.genToken(data.userID, 'auth');
        return token;
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

        let token = await AuthConnector.genToken(user.data.userID, 'auth');
        let refresh_token = await AuthConnector.genToken(user.data.userID, 'refresh');
        return {token, refresh_token};
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
        
        if(exists.success) throw {
            error: 'the user already exists',
            status: 409
        };

        let auther = await Auth.getInstance(email, password);
        let result = await performQuery(
            config.database.mongodb.dbSchool,
            'auth',
            async collection => {
                return await collection.insertOne(auther)
            }
        )

        if(!result.success) throw {
            error: 'We cannot create the user authentication',
            status: 500
        };

        let token = await AuthConnector.genToken(auther.userID, 'auth');
        let refresh_token = await AuthConnector.genToken(auth.userID, 'refresh');

        return {
            token,
            refresh_token,
            sc: new StudentConnector(auther.userID, auther.email)
        }
    }

    static async logout(userID) {
        let result = await performQuery(
            config.database.mongodb.dbSchool,
            'refresh_token',
            async collection => (
                await collection.deleteOne({userID})
            )
        );

        if(!result.success) throw {
            status: 404,
            error: 'resource not found, the user is not loged in'
        };
    }
}

module.exports = AuthConnector;