const db = require('../util/database');

module.exports = class User{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    };
}