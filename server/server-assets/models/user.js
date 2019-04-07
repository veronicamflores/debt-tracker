let mongoose = require('mongoose')
let Schema = mongoose.Schema

//bcrypt uses hashing and salt to obfiscate your password 
let bcrypt = require('bcryptjs')
const SALT = 10


let schema = new Schema({
    name: { type: String, required: true },
    //every username must be unique on the database
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    totalDebt: { type: Number, required: true },
    paidDebt: { type: Number, required: true, default: 0 },
    password: { type: String, required: true },
    created: { type: Number, required: true, default: Date.now() }
})


//THESE TWO METHODS CAN BE COPIED FOR ALL USER SCHEMA'S

//statics are used to create Model methods
schema.statics.generateHash = function (password) {
    return bcrypt.hashSync(password, SALT)
}

//schema.methods are used to add a method to a Model instance
schema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', schema)