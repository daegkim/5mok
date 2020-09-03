const algo = require('./algorithm')

var io = require('socket.io')({
  pingTimeout: 600000
})
var game_nsp = io.of('/game_nsp')

var room_info = [{room_id: 1, members: []}]

game_nsp.on('connection', (socket) => {

  console.log('socket connect', socket.id)

  var isThereEmptyRoom = false
  var room_idx = 0
  for(room_idx in room_info){
    if(room_info[room_idx].members.length < 2){
      isThereEmptyRoom = true
      break
    }
  }

  //들어갈 수 있는 방이 있다면
  //방에 멤버가 0명이면 플레이어1로 추가된다.
  //방에 멤버가 1명이고 해당 멤버가 1이면 2로 2면 1로 추가된다.
  var player = 1
  if(isThereEmptyRoom){
    if(room_info[room_idx].members.length !== 0){
      player = room_info[room_idx].members[0] === 1 ? 2 : 1
    }

    room_info[room_idx].members.push(player)
  }
  else{
    room_info.push({
      room_id: room_info[room_idx].room_id + 1,
      members: [1]
    })
    room_idx++
  }

  socket.join('room' + room_info[room_idx].room_id)
  
  game_nsp.connected[socket.id].emit('init', {
    socket_id: socket.id,
    player: player
  })

  socket.on('disconnect', (reason) => {
    console.log(game_nsp.sockets.manager)
    console.log('socket disconnect', reason)
  })

  socket.on('data', (data) => {
    let x = parseInt(data.x)
    let y = parseInt(data.y)
    let player = parseInt(data.player)

    if(algo.putStoneOnMap(x,y,player)){
      algo.initMap()
      game_nsp.connected[socket.id].emit('result', {
        isCheckmate: 'checkmate',
        x: x,
        y: y,
        player: player,
        turn: player === 1 ? 2 : 1
      })
    }
    else{
      game_nsp.connected[socket.id].emit('result', {
        isCheckmate: '',
        x: x,
        y: y,
        player: player,
        turn: player === 1 ? 2 : 1
      })
    }
  })
})

module.exports = io;