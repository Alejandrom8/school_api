const DataBase = require('./DataBase');

class Model{
    constructor(){
        this.dbms = new DataBase();
    }
}

module.exports = Model;