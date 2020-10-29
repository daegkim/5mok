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

const roomSchema = new mongoose.Schema({
  roomId: {type: Number, required: true, unique: true},
  roomName: {type: String, default: 'MyROOM'},
  userNum: {type: Number, default: 1},
  maxNum: {type: Number, default: 2},
  userId: {type: String, required: true},
  startTime: {type: Date, default: Date.now},
  endTime: {type: Date, default: Date.now},
  useFlag: {type: Boolean, default: false}
})

module.exports = {
  list: mongoose.model('list', listSchema, 'list'),
  member: mongoose.model('member', listSchema, 'member'),
  room: mongoose.model('room', roomSchema, 'room')
}