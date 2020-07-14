"use strict";

const Model = require('../Model'),
      crypt = require('../processData/crypt'),
      Responser = require('../sendData/Responser'),
      Session = require('../consultData/TokenSession'),
      MongoClient = require('../DataBase');

class User extends Model{
    /**
     * constructor
     * @param {String} name - name of the user
     * @param {String} email - email of the user
     * @param {String} password - password of the user
     */
    constructor({name = '', email, password = ''} = {}){
        super();
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async getAsJSON(){
        return {
            name: this.name,
            email: this.email,
            password: await crypt.hashPassword(this.password)
        }
    }

    async signIn(){
        let db, collection, query, result, client, realPassword, passwordCompare,token;

        result = new Responser();

        try{
            client = await MongoClient.getClient();

            db = client.db(this.dbms.db);
            collection = db.collection(this.dbms.collection);
            query = await collection.findOne({email: this.email}, {password:true});
            if(!query) throw "Usuario incorrecto";

            realPassword = query.password;
            passwordCompare = await crypt.comparePasswords(this.password, realPassword);
            if(!passwordCompare) throw "Contraseña incorrecta";

            delete this.password;
            token = await Session.init(this.email);

            result.setSuccess({
                data: {'token': token}
            })
        }catch(err){
            result.errors = err;
        }finally{
            client.close();
        }

        return result;
    }

    async signOut(token){
        return await Session.close(token);
    }

    async signUp(subjects = {}){
        let db, collection, insert, result, client, token, info, exists;
        
        result = new Responser();

        try{
            client = await MongoClient.getClient();


            db = client.db(this.dbms.db);
            collection = db.collection(this.dbms.collection);

            exists = await collection.findOne({email: this.email});
            if(exists) throw "Ya existe un usuario con este email";

            info = Object.assign({}, await this.getAsJSON(), subjects);
            insert = await collection.insertOne(info);
            if(!insert.result.ok) throw "No se ha logrado registrar al usurio"; 

            delete this.password;
            token = await Session.init(this.email);

            delete insert.ops[0].password;

            result.setSuccess({
                messages: 'Registro exitoso',
                data: Object.assign({},insert.ops[0], {'token': token})
            })
        }catch(e){
            result.errors = e;
        }finally{
            client.close();
        }

        return result;
    }

    async delete(){
        let result, client, db, collection, deleteResult;

        result = new Responser();

        try{
            client = await MongoClient.getClient();

            db = client.db(this.dbms.db);
            collection = db.collection(this.dbms.collection);
            deleteResult = await collection.deleteOne({email: this.email});
            if(!deleteResult.result.ok) throw 'No se logro borrar al usuario';
            
            result.setSuccess({
                data: deleteResult.result.n
            })
        }catch(e){
            result.errors = e;
        }finally{
            client.close();
        }

        return result;
    }
}

module.exports = User;