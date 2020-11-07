var turn = 1

$(document).ready(() => {
  //오목판 클릭시
  $(document).on('click', '.div-board-cell', function() {
    let tmpCellId = parseInt($(this).attr('id'))
    let tmpUserId = $('#txtUserId').text()
    let color = player === 1 ? 'black' : 'white'
    if(turn !== player){
      alert('Not your turn')
      return
    }
    $(this).css('background-color', color)

    var x = $(this).closest('td').closest('tr')[0].rowIndex
    var y = $(this).closest('td')[0].cellIndex

    socket.emit('put_stone_on_map', {
        x: x,
        y: y,
        player: player,
        socket_id: socket.id
    })
  })
})