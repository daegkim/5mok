var socket = io({
    transport: ['websocket']
});

var isInRoom = false
var room_id = -1
var player = -1
var turn = 1
var canStart = false
var oppentStone = ''

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

    var h = $('table').css('height').replace('%', '')
    var body_height = $('body').css('height').replace('px')

    $('#div_board').find('table').css('width', parseInt(h) * parseInt(body_height) / 100 )
}

socket.on('connect', () => {
    console.log('connect to socket')
})

socket.on('create_room', (data) => {
    if(data.members[0] === socket.id){
        room_id = data.room_id
        document.getElementById('btnLeaveRoom').style.display = 'inline-block'
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
        console.log(data, room_id)
        if(data.room_id === room_id){
            $('td').click(tb_click)
            //this room member
            if(data.socket_id === socket.id){
                document.getElementById('div_board').style.display = 'block'
                document.getElementById('divRoomList').style.display = 'none'
                document.getElementById('btnLeaveRoom').style.display = 'block'
                player = 2
                alert(msg_welcome + data.room_id)
            }     
            //another room member
            else{
                player = 1
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
    if(data.isRoomDeleted){
        deleteRoomButton(data.room_id)
    }
    else{
        document.getElementById(data.room_id).innerHTML = '<p id=' + data.room_id + '>'+ 'member_num : 1' +  '</p>'
    }

    if(room_id === data.room_id){
        $('td').off('click', tb_click)
        init_board()
        if(data.socket_id === socket.id){
            room_id = -1
            player = -1
            document.getElementById('btnLeaveRoom').style.display = 'none'
            document.getElementById('divRoomList').style.display = 'block'
            document.getElementById('div_board').style.display = 'none'
        }
        else{
            if(!data.isRoomDeleted){
                socket.emit('end_game', data.room_id)
            }
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

socket.on('putStoneOnMap', (data) => {
    //1. 체크메이트인 경우
    //1.1. 이긴 사람 화면 : 당신이 이겼습니다.
    //1.2. 진 사람 화면 : 이긴사람ID가 이겼습니다. 
    //1.3. 화면 초기화
    //1.4. 게임 초기화
    //2. 체크메이트 아닌 경우
    //2.1. 말을 둔 사람과 상대편 모두 해당 위치에 말 표시
    //3. undefined라면
    //3.1. 둔 사람 화면만 : 해당 위치에 이미 있음
    if(data.result === undefined && data.socket_id === socket.id){
        alert('해당 위치에 이미 말이 있습니다')
        return
    }

    turn = data.turn
    let color = data.player === 1 ? 'black' : 'white'
    $('#td'+data.pos).css('background-color', color)

    //상대가 둔 돌은 깜빡거림
    if(data.player !== player){
        oppentStone = '#td'+data.pos
        $('#td'+data.pos).addClass('stoneBlink')
    }

    if(data.result){
        init_board()
        if(data.player === player){
            socket.emit('end_game', room_id)
            alert('당신이 이김')
        }
        else{
            alert('당신이 짐')
        }
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

function tb_click(e){
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

    $(oppentStone).removeClass('stoneBlink')

    socket.emit('putStoneOnMap', {
        x: x,
        y: y,
        player: player,
        socket_id: socket.id
    })
}

function init_board(){
    $('td').css('background-color', 'rgba(0, 0, 0, 0)')
    turn = 1
}