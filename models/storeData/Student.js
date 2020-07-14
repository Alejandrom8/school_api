const User = require('./User'),
      MongoClient = require('../DataBase'),
      Responser = require('../sendData/Responser'),
      config = require('../../config');

class Student extends User{

    constructor({name = '', email, password = '', semester = '', subjects = []} = {}){
        super({name: name, email: email, password: password});
        this.semester = semester;
        this.subjects = subjects;
    }

    subjectsAsJSON(){
        return {
            semester: this.semester,
            subjects: this.subjects
        }
    }

    static async getMainInfo(token){
        let client, query, db, collection, result;

        result = new Responser();

        let redis_cli = require('../redis_con');
        let email = await new Promise((res, rej) => {
            redis_cli.get(token, (err, data) => {
                if(err) rej(err);
                res(data);
            });
        });

        if(!email){result.errors = "No existe la sesión"; return result;}

        client = await MongoClient.getClient();
        if(!client){ result.errors = "No se pudo conectar a la base de datos"; return result; }

        try{
            db = client.db(config.database.mongodb.db);
            collection = db.collection('user');
            query = await collection.findOne({email: email});
            if(!query) throw "El usuario no existe";

            result.success = true;
            result.data = query;
        }catch(e){
            console.log(e);
        }finally{
            return result;
        }
    }

    async signUp(){
        return await super.signUp(this.subjectsAsJSON());
    }
}

module.exports = Student;