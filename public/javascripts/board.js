var player = 0
var turn = 1

$(() => {
    var x = -1
    var y = -1


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