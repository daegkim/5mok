const mongoose = require('mongoose')
const {list, member} = require('./schema.js')

class db {
    constructor(){
        mongoose.Promise = global.Promise
        mongoose.set('useUnifiedTopology', true) //prevent deprecation warnings
        mongoose.connection.on('error', (err) => { if(err) console.log(err)} )
        mongoose.connection.once('open', () => { console.log('mongo connected!!') })

        mongoose.connect('mongodb://localhost:27017/testdb', {useNewUrlParser: true}, (err) => { if(err) console.log(err) })
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