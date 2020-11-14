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
    var dataArr = $('#formCreateRoom').serializeArray()

    var dataJSON = {}
    for(var i of dataArr){
      dataJSON[i.name] = i.value
    }
    
    var roomName = dataJSON.name
    var roomPwd = dataJSON.pwd
    var userId = $('#txtUserId').text()

    if(roomName === undefined || roomName === null || roomName === ''){
      roomName = userId + '\'s room'
    }

    if(roomPwd === undefined || roomPwd === ''){
      roomPwd = null
    }

    socket.emit('create_room', {
      roomName: roomName,
      roomPwd: roomPwd,
      owner: userId,
    })
  })

  //SignUp 버튼 클릭시
  $('#btnSignUp').click(() => {
    var dataArr = $('#formSignUp').serializeArray()
    var dataJSON = {}
    for(var i of dataArr){
      dataJSON[i.name] = i.value
    }

    $.ajax({
      url: './sign_up',
      type: 'post',
      data: JSON.stringify(dataJSON),
    })
    .done((_data) => {
      if(_data.error === undefined || _data.error === null){
        $('#modal-signup').modal('hide')
        setTimeout(() => {
          alert("COMPLETE REGISTERATION! PLEASE SIGN IN!")
        }, 500)
      }
      else{
        alert(error)
      }
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