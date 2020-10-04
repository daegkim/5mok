const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    id: Number,
    title: String,
    content: String
})

const memberSchema = new mongoose.Schema({
    id: Number,
    name: String
})

module.exports = {
    list: mongoose.model('list', listSchema, 'list'),
    member: mongoose.model('member', listSchema, 'member')
}