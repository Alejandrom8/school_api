const bcrypt = require("bcrypt"),
      util = require('util');

//support for async/await in this functions.
const compare = util.promisify(bcrypt.compare).bind(bcrypt),
      hash = util.promisify(bcrypt.hash).bind(bcrypt);

/**
 * Hashes a password with 10 rounds of salt.
 * @param {String} password - the natural language string.
 * @returns {Promise<String>} - the hashed password.
 */
exports.hashPassword = async (password) => await hash(password, 10);
/**
 * Compare two passwords, one as plain text and the other as a hash.
 * @param {String} plainText - the natural language string.
 * @param {String} hash - the hashed string.
 * @returns {Promise<Boolean>} - true if the passwords are correct.
 */
exports.comparePasswords = async (plainText, hash) => await compare(plainText, hash);