var io = require('socket.io')();

var room_info = []
/*
{
    room_id: 1,
    members: []
    game_algo: 
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
    })

    io.to(socket.id).emit('init_room_info', room_info)
})

module.exports = io;