$(document).ready(() => {
  $('#viewer').toastuiEditor({
    height: '500px',
    initialValue: '# DEV DIARY\n1. 서론\n2. 본론'
  });

  //[event]
  //비번방 체크박스 선택시
  $('#chkRoomPwd').change(() => {
    if($('#chkRoomPwd').is(':checked')){
      $('#txtRoomPwd').removeAttr('disabled')
    }
    else{
      $('#txtRoomPwd').attr('disabled', true)
    }
  })

  //Create 버튼 클릭시
  $('#btnCreateRoom').click(() => {
    var roomName = $('#txtRoomName').text()
    var roomPwd = ''
    var chkRoomPwd = $('#chkRoomPwd').is(':checked')
    var userId = $('#txtUserId').text()

    if(roomName === undefined || roomName === null || roomName === ''){
      roomName = userId + '\'s room'
    }

    if(chkRoomPwd){
      roomPwd = $('#txtRoomPwd').text()
      if(roomPwd === undefined || roomPwd === null || roomPwd === ''){
        roomPwd = null
      }
    }

    socket.emit('create_room', {
      roomName: roomName,
      roomPwd: roomPwd,
      owner: userId,
    })
  })
})