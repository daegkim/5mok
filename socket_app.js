var io = require('socket.io')({
    transports: ['websocket']
});
var game = require('./game/algorithm');

var room_info = []
/*
{
    room_id: 1,
    members: []
    game: 
}
*/

io.on('connect', (socket) => {
    console.log('socket_app connected')

    socket.on('create_room', () => {
        let room_len = room_info.length
        let new_room_id = 1

        if(room_len > 0){
            new_room_id = room_info[room_len - 1].room_id + 1
        }

        let new_room = {
            room_id: new_room_id,
            members: [socket.id],
            game: new game()
        }

        room_info.push(new_room)

        socket.join('room' + new_room_id)

        io.emit('create_room', new_room)
    })

    socket.on('join_room', (data) => {
        let result = false

        for(let i in room_info){
            if(room_info[i].room_id === data){
                if(room_info[i].members.length === 1){
                    if(room_info[i].members[0] === socket.id){
                        break
                    }
                    room_info[i].members.push(socket.id)
                    socket.join('room' + data)
                    result = true
                }
                break
            }
        }

        io.emit('join_room',{
            result: result,
            socket_id: socket.id,
            room_id: data
        })
    })

    socket.on('disconnect', () => {
        leave_room(socket)
    })

    socket.on('leave_room', () => {
        let room_id = 'room' + getRoomIDBySocketID(socket.id)
        socket.leave(room_id + room_id)
        leave_room(socket)
    })

    socket.on('putStoneOnMap', (data) => {
        let room_id = getRoomIDBySocketID(socket.id)
        let room_game = getGameByRoomId(room_id)

        let result = room_game.putStoneOnMap(data.x, data.y, data.player)
        let send_data = {
            result: result,
            pos: parseInt(data.x) * 18 + parseInt(data.y),
            player: data.player,
            socket_id: socket.id,
            turn: data.player === 1 ? 2 : 1
        }

        io.to('room' + room_id).emit('putStoneOnMap', send_data)
    })

    socket.on('end_game', (data) => {
        getGameByRoomId(parseInt(data)).initMap()
    })

    io.to(socket.id).emit('init_room_info', room_info)
})

const leave_room = (socket) => {
    let room_id = -1
    let isRoomDeleted = false
    let flag = false

    for(var i in room_info){
        for(var j in room_info[i].members){
            if(room_info[i].members[j] === socket.id){
                //delete the member from the room
                room_id = room_info[i].room_id
                room_info[i].members.splice(j, 1)
                //delete the room
                if(room_info[i].members.length === 0){
                    room_info.splice(i, 1)
                    isRoomDeleted = true
                }
                else{
                    room_info[i].game.initMap()
                }

                flag = true
                break
            }
        }
        if(flag){
            break
        }
    }



    if(room_id > 0){
        io.emit('leave_room', {
            room_id: room_id,
            socket_id: socket.id,
            isRoomDeleted: isRoomDeleted
        })
    }
}

const getRoomIDBySocketID = (socket_id) => {
    let result = ''
    for(var i in room_info){
        let flag = false
        for(var j in room_info[i].members){
            if(room_info[i].members[j] === socket_id){
                result = room_info[i].room_id
                break
            }
        }
        if(flag){
            break
        }
    }
    return result
}

const getGameByRoomId = (_room_id) => {
    let result = null
    for(let i in room_info){
        let flag = false
        if(room_info[i].room_id === _room_id){
            result = room_info[i].game
            break
        }
        if(flag){
            break
        }
    }
    return result
}

module.exports = io;