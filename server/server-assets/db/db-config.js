var mongoose = require('mongoose')
var connectionString = 'mongodb://'
var connection = mongoose.connection


mongoose.connect(connectionString, { useMongoClient: true })

connection.on('error', err => {
    console.log('ERROR FROM DATABASE: ', err)
})


connection.once('open', () => {
    console.log('Connected to Database')
})