const mongoose = require('mongoose')
const {list, member, room} = require('./schema.js')

class db {
  constructor(){
    mongoose.Promise = global.Promise
    mongoose.set('useUnifiedTopology', true) //prevent deprecation warnings
    mongoose.connection.on('error', (err) => { if(err) console.log(err)} )
    mongoose.connection.once('open', () => { console.log('mongo connected!!') })

    mongoose.connect('mongodb://localhost:27017/testdb', {useNewUrlParser: true}, (err) => { if(err) console.log(err) })
  }

  getRoomList(callback){
    room.find({useFlag: true}).sort('roomId').exec()
    .then((res) => {
      callback(null, res)
    })
    .catch((err) => {
      mongoose.disconnect()
      callback(err, res)
    })
  }

  createNewRoom(roomInfo, callback){
    const newRoom = new room({
      roomId: roomInfo.roomId,
      roomName: roomInfo.roomName,
      userId: roomInfo.userId,
      useFlag: roomInfo.userFlag
    })

    newRoom.save()
    .then(() => {
    })
    .catch((err) => {
      mongoose.disconnect()
    })
  }


  getList(callback){
        list.find((err, res) => {
            if(err){
                console.log(err)
                mongoose.disconnect()
                return
            }
            mongoose.disconnect()
            callback(res)
        })
    }

    setItem(newItem, callback){
        list.create(newItem, (err) => {
            if(err){
                console.log(err)
                mongoose.disconnect()
                return
            }
            callback()
        })
    }
}

module.exports = db