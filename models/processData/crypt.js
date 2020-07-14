const bcrypt = require("bcrypt"),
      util = require('util');

const compare = util.promisify(bcrypt.compare).bind(bcrypt),
      hash = util.promisify(bcrypt.hash).bind(bcrypt);

exports.hashPassword = async (password) => await hash(password, 10);

exports.comparePasswords = async (plainText, hash) => await compare(plainText, hash);