const { promisify } = require('util'),
	  uuid = require('uuid-random');

class TokenSession{
	constructor(token = ''){
		this.token = token;
		this.client = require('../redis_con');
		this.set = promisify(this.client.set).bind(this.client);
		this.get = promisify(this.client.get).bind(this.client);
		this.del = promisify(this.client.DEL).bind(this.client);
	}

	async initSession(email){
        let token = uuid();
        await this.set(token, email);
        return token;
    }

	async closeSession(token = null){
        let result = await this.del(token || this.token);
        return result;
    }
}

exports.init = async (email) => {
	let session = new TokenSession();
	return await session.initSession(email);
}

exports.close = async (token) => {
	let session = new TokenSession();
	return await session.closeSession(token);
}