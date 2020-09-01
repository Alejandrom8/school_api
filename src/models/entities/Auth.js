const crypt = require('../../util/crypt'),
      { genRandomKey } = require('../../util/generators');

class Auth {
    /**
     * creates an instance of the Auth class.
     * @param {String} email - the email of the user.
     * @param {String} password - the password of the user.
     * @returns {Promise<Auth>} the instance of the class.
     */
    static async getInstance(email, password) {
        return {
            userID: genRandomKey(12),
            email,
            password: await crypt.hashPassword(password)
        };
    }
}

module.exports = Auth;