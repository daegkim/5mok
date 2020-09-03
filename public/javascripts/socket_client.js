var socket = io();
var isInRoom = false
var room_id = -1
const msg_join_fail = 'You\'re already in the room'
const msg_welcome = 'Welcome to room'
const msg_full = 'This room is already full'
const msg_leave = ' leaves this room'

window.onload = () => {
    document.getElementById('btnCreateRoom').onclick = () => {
        if(room_id >= 0){
            alert(msg_join_fail + room_id)
            return
        }
        else{
            socket.emit('create_room')
        }
    }
}

socket.on('connect', () => {
    console.log('connect to socket')
})

socket.on('create_room', (data) => {
    if(data.members[0] === socket.id){
        room_id = data.room_id
    }
    
    let btnNewRoom = createRoomButton(data.room_id, 1)
    document.getElementById('divRoomList').appendChild(btnNewRoom)
    document.getElementById('div_board').style.display = 'block'
})

socket.on('join_room', (data) => {
    if(data.result){
        document.getElementById(data.room_id).innerText = 'this room is full'

        if(data.socket_id === socket.id){
            room_id = data.room_id
            document.getElementById('div_board').style.display = 'block'
        }

        if(data.room_id === room_id){
            if(data.socket_id === socket.id){
                alert(msg_welcome + data.room_id)
            }
            else{
                alert(socket.id + ' comes')
            }
        }
    }
    else{
        if(data.socket_id === socket.id){
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
        alert(data.socket_id + msg_leave)

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
        socket.emit('join_room', _room_id)
    }
    return btnNewRoom
}

function deleteRoomButton(_room_id){
    let btnSelected = document.getElementById(_room_id).parentElement
    document.getElementById('divRoomList').removeChild(btnSelected)
}