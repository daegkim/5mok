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
    var roomName = $('#txtRoomName').val()
    var roomPwd = $('#txtRoomPwd').val()
    var chkRoomPwd = $('#chkRoomPwd').is(':checked')
    var userId = $('#txtUserId').text()

    if(roomName === undefined || roomName === null || roomName === ''){
      roomName = userId + '\'s room'
    }

    if(chkRoomPwd){
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

  //방목록 클릭시
  $(document).on('click', '.roomName', function() {
    /*
    $(this)를 사용하려면 arrow function을 사용하면 안된다.
    arrow function은 자신의 this, arguments, super, new.target을 바인딩 하지 않는다.
    그야말로 익명함수
    */
    let tmpRoomId = parseInt($(this).closest('tr').children('.roomId').text())
    let tmpUserId = $('#txtUserId').text()
    socket.emit('join_room', {
      roomId: tmpRoomId,
      userId: tmpUserId
    })
  })
})