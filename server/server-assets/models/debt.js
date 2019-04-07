let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
let schemaName = 'Debt'

let schema = new Schema({
    name: { type: String, required: true },
    item: { type: String },
    debtTotal: { type: Number, required: true },
    debtPaid: { type: Number, required: true, default: 0 },
    created: { type: Date, default: Date.now(), required: true },
    authorId: { type: ObjectId, ref: 'User', required: true },

})


module.exports = mongoose.model(schemaName, schema)