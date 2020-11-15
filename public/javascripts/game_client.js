var turn = 1

$(document).ready(() => {
  //오목판 클릭시
  $(document).on('click', '.div-board-cell', function() {
    let color = player === 1 ? 'black' : 'white'
    if(turn !== player){
      alert('Not your turn')
      return
    }
    //$(this).css('background-color', color)

    var x = $(this).closest('td').closest('tr')[0].rowIndex
    var y = $(this).closest('td')[0].cellIndex

    socket.emit('put_stone_on_map', {
      x: x,
      y: y,
      player: player,
      roomId: roomId,
      socket_id: socket.id
    })
  })

  //ready에서 해야 width를 가져올 수 있음.
  //안그러면 %로 가져와짐
  //DOM구조에 올라가고 나서 해야 상대너비가 절대위치로 변경되는듯
  var winWidth = $(window).width()
  if(winWidth < 768){
    var boardWidth = $('.tb-board').width()
    $('.tb-board').css('height', boardWidth)
  }
})