var io = require('socket.io')({ transports: ['websocket'] });
var game = require('./game/algorithm');
var util = require('./utils/util')

var rooms = []
/*
room = {
  roomId: number,
  roomName: string,
  roomPwd: string,
  createTime: string,
  members: [[userId, socketId],[userId, socketId]],
  owner: string
  game: game
}
*/

io.on('connect', (socket) => {
  console.log('socket_app connected')

  // 처음 접속한 유저에게 현재 존재하는 방 목록을 보여줌
  var roomsForClient = []
  for(var room of rooms){
    roomsForClient.push({
      roomId: room.roomId,
      roomName: room.roomName,
      owner: room.owner,
      isPwdSet: (room.roomPwd === null || room.roomPwd === undefined) ? false : true,
      createTime: room.createTime,
      memberCount: room.members.length
    })
  }
  io.to(socket.id).emit('send_rooms', roomsForClient)

  //방을 만들겠다는 요청이 들어온 경우
  socket.on('create_room', (_room) => {
    try{
      let roomLen = rooms.length
      let roomId = 1
      let date = new util().getTimeStamp()

      if(roomLen > 0){
        roomId = rooms[roomLen - 1].roomId + 1
      }

      rooms.push({
        roomId: roomId,
        roomName: _room.roomName,
        roomPwd: _room.roomPwd,
        createTime: date,
        members: [],
        owner: _room.owner,
        game: new game()
      })

      io.emit('success_create_room', {
        roomId: roomId,
        roomName: _room.roomName,
        owner: _room.owner,
        memberCount: 0,
        createTime: date,
      })
    }
    catch (err){
      console.log(err)
      io.emit('fail_create_room')
    }
  })

  //방에 참가하겠다는 요청이 들어온 경우
  socket.on('join_room', (_room) => {
    //rooms에서 room을 찾아서 members에 사람을 넣는다.
    //1. 만약 주인이 들어가려는 경우 : PWD체크안함
    //2. 만약 타인이 들어가려는 경우 : PWD체크함
    //3. 방이 꽉 찼으면 못 들어감
    //4. 성공적으로 방에 들어가졌으면 전체에게 한 명 들어왔다고 말해줘서 인원 수 업데이트 해야함
    console.log(_room)
    for(var room of rooms){
      if(room.roomId === parseInt(_room.roomId)){
        //방이 꽉 찬 경우
        if(room.members.length === 2){
          //error
        }

        //방 주인이 아니고 비밀번호가 틀린 경우
        if(room.owner !== _room.userId){
          if(room.roomPwd !== _room.roomPwd){
            //error
          }
        }

        //방에 들어가기
        socket.join('room' + _room.roomId)

        room.members.push({
          userId: _room.userId,
          socketId: socket.id
        })

        io.emit('success_join_room', {
          roomId: room.roomId,
          userId: _room.userId,
          memberCount: room.members.length
        })
        break
      }
    }
  })
    /*
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
    */
})

/*
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
*/
module.exports = io;