var socket = io({
    transport: ['websocket']
});

var roomId = -1
var player = -1

const msg_join_fail = 'You\'re already in the room'
const msg_welcome = 'Welcome to room'
const msg_full = 'This room is already full'
const msg_leave = ' leaves this room'

function changeElemSize(){
  //ready에서 해야 width를 가져올 수 있음.
  //안그러면 %로 가져와짐
  //DOM구조에 올라가고 나서 해야 상대너비가 절대위치로 변경되는듯
  var screenWidth = screen.width
  var windowWidth = window.innerWidth

  if(screenWidth < 480 || windowWidth < 780){
    $('.div-left').removeClass('col-5')
    $('.div-right').removeClass('col-5')
    $('.div-first-row').children('span').removeClass('col-2')
    $('.cell-deleted').hide()
  }
  else{
    $('.div-left').addClass('col-5')
    $('.div-right').addClass('col-5')
    $('.div-first-row').children('span').addClass('col-2')
    $('.cell-deleted').show()
  }

  if($('.tb-board')[0] !== undefined){
    var boardWidth = $('.tb-board').width()
    $('.tb-board').css('height', boardWidth)
  }
}

$(document).ready(function(){
  changeElemSize()

  $(window).resize(function(){
    changeElemSize()
  })
})

addToTbRooms = (_room) => {
  var newRoomRow = '<tr id=\'room' + _room.roomId + '\'>'
  newRoomRow += '<th>' + _room.roomId + '</th>'
  newRoomRow += '<td class=\'roomName\'>' + _room.roomName + '</td>'
  newRoomRow += '<td>' + _room.owner + '</td>'
  newRoomRow += '<td class=\'memCnt\'>' + _room.memberCount + '</td>'
  newRoomRow += '<td class=\'cell-deleted\'>' + _room.createTime + '</td>'
  newRoomRow += '<td class=\'roomId\' hidden>' + _room.roomId + '</td>'
  newRoomRow += '</tr>'
  $('#tbRooms > tbody:last').append(newRoomRow)
  changeElemSize()
}

socket.on('connect', () => {
    console.log('connect to socket')
})

socket.on('send_rooms', (_rooms) => {
  for(let room of _rooms){
    addToTbRooms(room, socket)
  }
})

socket.on('success_create_room', (_room) => {
  console.log(_room)
  addToTbRooms(_room)
  if(_room.owner === $('#txtUserId').text()){
    $('input[name="roomId"]').val(_room.roomId)
    $('input[name="userId"]').val($('#txtUserId').text())
    $('#formOpenGame').attr('action', './game')
    $('#formOpenGame').attr('method', 'post')
    $('#formOpenGame').submit()
  }
})

socket.on('success_join_room', (_room) => {
  //대기실에 있으면 누구든 방 목록의 인원수 변경
  if($(location).attr('pathname') === '/'){
    $('#' + 'room' + String(_room.roomId)).find('td.memCnt').html(_room.memberCount)
    if(_room.userId === $('#txtUserId').text()){
      $('input[name="roomId"]').val(_room.roomId)
      $('input[name="userId"]').val($('#txtUserId').text())
      $('#formOpenGame').attr('action', './game')
      $('#formOpenGame').attr('method', 'post')
      $('#formOpenGame').submit()
    }
    //방에 들어가려고 한 인원이면 방 이동
    return
  }

  //게임방에 있는 경우, 다른 인원은 경고창 발생
  if($(location).attr('pathname') === '/game'){
    if(_room.userId === $('#txtUserId').text()){
      player = _room.player
    }
    else{
      if(_room.roomId === roomId){
        alert(_room.userId)
      }
    }
  }
})

socket.on('fail_join_room', (_error) => {
  alert(_error)
})

socket.on('leave_room', (_room) => {
  //대기실에 있으면 누구든 방 목록의 인원수 변경
  if($(location).attr('pathname') === '/'){
    var row = $('#' + 'room' + String(_room.roomId))
    if(_room.isDeletedRoom){
      row.remove()
    }
    else{
      row.find('td.memCnt').html(_room.memberCount)
    }
    return
  }
})

socket.on('success_put_stone_on_map', (_data) => {
  //1. 체크메이트인 경우
  //1.1. 이긴 사람 화면 : 당신이 이겼습니다.
  //1.2. 진 사람 화면 : 이긴사람ID가 이겼습니다. 
  //1.3. 화면 초기화
  //1.4. 게임 초기화
  //2. 체크메이트 아닌 경우
  //2.1. 말을 둔 사람과 상대편 모두 해당 위치에 말 표시
  //3. undefined라면
  //3.1. 둔 사람 화면만 : 해당 위치에 이미 있음
  if(_data.result === undefined){
    if(_data.player === player){
      alert('해당 위치에 이미 말이 있습니다')
    }
    return
  }

  turn = _data.turn

  let color = _data.player === 1 ? 'black' : 'white'
  $('#cell'+_data.pos).css('background-color', color)

  //상대가 둔 돌은 깜빡거림
  if(_data.player !== player){

  }

  if(_data.result){
      init_board()
      if(_data.player === player){
          //socket.emit('end_game', room_id)
          alert('당신이 이김')
      }
      else{
          alert('당신이 짐')
      }
  }
})

function init_board(){
  $('.div-board-cell').css('background-color', 'rgba(0, 0, 0, 0)')
  turn = 1
}