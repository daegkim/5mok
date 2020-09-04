var socket = io();

var isInRoom = false
var room_id = -1
var player = -1
var turn = 1

const msg_join_fail = 'You\'re already in the room'
const msg_welcome = 'Welcome to room'
const msg_full = 'This room is already full'
const msg_leave = ' leaves this room'

window.onload = () => {
    $('#btnCreateRoom').click(() => {
        if(room_id >= 0){
            alert(msg_join_fail + room_id)
            return
        }
        else{
            socket.emit('create_room')
        }
    })

    $('#btnLeaveRoom').click(() => {
        socket.emit('leave_room')
    })

    $('td').click((e) => {
        console.log(e)
        //이미 바둑알이 있는 경우 둘 수 없음
        if($('#'+e.target.id).css('background-color') !== 'rgba(0, 0, 0, 0)'){
            alert('해당 위치에 이미 말이 있습니다.')
            return
        }

        if(player !== turn){
            alert('당신 차례가 아닙니다.')
            return
        }

        x = e.target.parentElement.rowIndex
        y = e.target.cellIndex

        socket.emit('data', {
            x: x,
            y: y,
            player: player
        })
    })
}

socket.on('connect', () => {
    console.log('connect to socket')
})

socket.on('create_room', (data) => {
    if(data.members[0] === socket.id){
        room_id = data.room_id
        document.getElementById('btnLeaveRoom').style.display = 'block'
        document.getElementById('divRoomList').style.display = 'none'
        document.getElementById('div_board').style.display = 'block'
        player = 1
    }
    
    let btnNewRoom = createRoomButton(data.room_id, 1)
    document.getElementById('divRoomList').appendChild(btnNewRoom)
})

socket.on('join_room', (data) => {
    if(data.result){ //join success
        document.getElementById(data.room_id).innerText = 'this room is full'

        //same room
        if(data.room_id === room_id){
            //this room member
            if(data.socket_id === socket.id){
                console.log(socket.id, data.socket_id)
                document.getElementById('div_board').style.display = 'block'
                document.getElementById('divRoomList').style.display = 'none'
                document.getElementById('btnLeaveRoom').style.display = 'block'
                player = 2
                alert(msg_welcome + data.room_id)
            }     
            //another room member
            else{
                alert(socket.id + ' comes')
            }
        }
    }
    else{ //join fail
        if(data.socket_id === socket.id){
            room_id = -1
            alert(msg_full)
        }
    }
})

socket.on('leave_room', (data) => {
    console.log(data)

    if(data.isRoomDeleted){
        deleteRoomButton(data.room_id)
    }
    else{
        document.getElementById(data.room_id).innerHTML = '<p id=' + data.room_id + '>'+ 'member_num : 1' +  '</p>'
    }

    if(room_id === data.room_id){
        if(data.socket_id === socket.id){
            room_id = -1
            player = -1
            document.getElementById('btnLeaveRoom').style.display = 'none'
            document.getElementById('divRoomList').style.display = 'block'
            document.getElementById('div_board').style.display = 'none'
        }
        else{
            alert(data.socket_id + msg_leave)
        }
    }
})

socket.on('init_room_info', (data) => {
    for(let i in data){
        let btnNewRoom = createRoomButton(data[i].room_id, data[i].members.length)
        document.getElementById('divRoomList').appendChild(btnNewRoom)
    }
})

function createRoomButton(_room_id, _member_num){
    let btnNewRoom = document.createElement('button')
    btnNewRoom.innerHTML = '<p>'+ 'room' + _room_id + '</p>'
    if(_member_num === 1){
        btnNewRoom.innerHTML += '<p id=' + _room_id + '>'+ 'member_num : ' + _member_num + '</p>'
    }
    else{
        btnNewRoom.innerHTML += '<p id=' + _room_id + '>'+ 'this room is full' + '</p>'
    }
    //add join event
    btnNewRoom.onclick = () => {
        if(room_id >= 0){
            alert(msg_join_fail + room_id)
            return
        }
        room_id = _room_id
        socket.emit('join_room', _room_id)
    }
    return btnNewRoom
}

function deleteRoomButton(_room_id){
    let btnSelected = document.getElementById(_room_id).parentElement
    document.getElementById('divRoomList').removeChild(btnSelected)
}