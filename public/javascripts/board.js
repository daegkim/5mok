var player = 0
var turn = 1

$(() => {
    var socket = io('/game_nsp')
    var x = -1
    var y = -1

    socket.on('connect', () => {
        console.log('connect', socket.id)
    })

    socket.on('init', (data) => {
        console.log('init')
        if(data.socket_id === socket.id){
            player = data.player
        }
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)
    })

    socket.on('result', (result) => {
        var id = result.x * 18 + result.y

        if(result.isCheckmate === 'checkmate'){
            alert(result.player + '번 플레이어 승리')
        }

        if(result.player === 1){
            $('#td' + id).css('background-color', 'black')
        }
        else{
            $('#td' + id).css('background-color', 'white')
        }

        turn = result.turn
    })

    $('td').click((e) => {
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
})